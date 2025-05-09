const express = require("express");
const router = express.Router();
const { User, Course } = require("../../models");
const { Op } = require("sequelize");
const { NotFoundError } = require("../../utils/errors");
const { success, failure } = require("../../utils/responses");
/**
 * 获取用户列表
 * GET /admin/users
 */
router.get("/", async function (req, res) {
  try {
    const query = req.query;
    const currentPage = Math.abs(Number(query.currentPage)) || 1;
    const pageSize = Math.abs(Number(query.pageSize)) || 10;
    const offset = (currentPage - 1) * pageSize;
    const condition = {
      include: [
        {
          model: Course,
          as: "courses",
          attributes: ["name"],
        },
      ],
      where: {},
      order: [["id", "DESC"]],
      limit: pageSize,
      offset: offset,
    };
    if (query.email) {
      condition.where.email = query.email;
    }

    if (query.username) {
      condition.where.username = query.username;
    }

    if (query.nickname) {
      condition.where.nickname = {
        [Op.like]: `%${query.nickname}%`,
      };
    }

    if (query.role) {
      condition.where.role = query.role;
    }
    const { rows, count } = await User.findAndCountAll(condition);

    success(res, "查询用户列表成功。", {
      users: rows,
      pagination: {
        total: count,
        currentPage,
        pageSize,
      },
    });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 获取单篇用户
 * GET /admin/users/:id
 */
router.get("/:id", async function (req, res) {
  try {
    // 查询用户
    const user = await getUser(req);
    success(res, "查询用户成功。", { user });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 创建用户
 * POST /admin/users
 */
router.post("/", async function (req, res) {
  try {
    // 白名单过滤
    const body = filterBody(req);

    // 使用 req.body 获取到用户通过 POST 提交的数据，然后创建用户
    const user = await User.create(body);

    success(res, "创建用户成功。", { user }, 201);
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 删除用户
 * DELETE /admin/users/:id
 */
router.delete("/:id", async function (req, res) {
  try {
    const user = await getUser(req);
    // 删除用户
    await user.destroy();

    success(res, "删除用户成功。");
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 更新用户
 * PUT /admin/users/:id
 */
router.put("/:id", async function (req, res) {
  try {
    const user = await getUser(req);
    // 白名单过滤
    const body = filterBody(req);
    await user.update(body);
    success(res, "更新用户成功。", { user });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 公共方法：白名单过滤
 * @param req
 */
function filterBody(req) {
  return {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    nickname: req.body.nickname,
    sex: req.body.sex,
    company: req.body.company,
    introduce: req.body.introduce,
    role: req.body.role,
    avatar: req.body.avatar,
  };
}

/**
 * 公共方法：查询当前用户
 */
async function getUser(req) {
  // 获取用户 ID
  const { id } = req.params;

  // 查询当前用户
  const user = await User.findByPk(id);

  // 如果没有找到，就抛出异常
  if (!user) {
    throw new NotFoundError(`ID: ${id}的用户未找到。`);
  }

  return user;
}

module.exports = router;
