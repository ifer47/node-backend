const express = require("express");
const router = express.Router();
const { Category, Course } = require("../../models");
const { Op } = require("sequelize");
const { NotFoundError } = require("../../utils/errors");
const { success, failure } = require("../../utils/responses");
/**
 * 获取分类列表
 * GET /admin/categories
 */
router.get("/", async function (req, res) {
  try {
    const query = req.query;

    const condition = {
      include: {
        model: Course,
        as: "courses",
        attributes: ["name"]
      },
      where: {},
      order: [
        ["rank", "ASC"],
        ["id", "ASC"],
      ],
    };

    if (query.name) {
      condition.where.name = {
        [Op.like]: `%${query.name}%`,
      };
    }

    const categories = await Category.findAll(condition);
    success(res, "查询分类列表成功。", {
      categories: categories,
    });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 获取单篇分类
 * GET /admin/categories/:id
 */
router.get("/:id", async function (req, res) {
  try {
    // 查询分类
    const category = await getCategory(req);
    success(res, "查询分类成功。", { category });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 创建分类
 * POST /admin/categories
 */
router.post("/", async function (req, res) {
  try {
    // 白名单过滤
    const body = filterBody(req);

    // 使用 req.body 获取到用户通过 POST 提交的数据，然后创建分类
    const category = await Category.create(body);

    success(res, "创建分类成功。", { category }, 201);
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 删除分类
 * DELETE /admin/categories/:id
 */
router.delete("/:id", async function (req, res) {
  try {
    const category = await getCategory(req);
    // 查询当前分类下的课程梳理
    const count = await Course.count({ where: { categoryId: req.params.id } });
    if (count > 0) {
      throw new Error("当前分类有课程，无法删除。");
    }
    // 删除分类
    await category.destroy();
    success(res, "删除分类成功。");
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 更新分类
 * PUT /admin/categories/:id
 */
router.put("/:id", async function (req, res) {
  try {
    const category = await getCategory(req);
    // 白名单过滤
    const body = filterBody(req);
    await category.update(body);

    success(res, "更新分类成功。", { category });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{name, rank: (string|string|DocumentFragment|*)}}
 */
function filterBody(req) {
  return {
    name: req.body.name,
    rank: req.body.rank,
  };
}

/**
 * 公共方法：查询当前分类
 */
async function getCategory(req) {
  // 获取分类 ID
  const { id } = req.params;

  // 查询当前分类
  const category = await Category.findByPk(id);

  // 如果没有找到，就抛出异常
  if (!category) {
    throw new NotFoundError(`ID: ${id}的分类未找到。`);
  }

  return category;
}

module.exports = router;
