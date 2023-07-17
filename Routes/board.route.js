const express = require("express");
const {
  PostBoard,
  PostTask,
  GetBoardTask,
  SubTask,
  GetBoard,
  EditTask,
  getSubtask,
  EditSubtask,
  DeleteSubtask,
  DeteteTask,
  DeleteBoard,
  EditBoard,
} = require("../Controller/board.controller");

const boardRouter = express.Router();

boardRouter.post("/", PostBoard);
boardRouter.get("/", GetBoard);
boardRouter.get("/:boardId/tasks", GetBoardTask);
boardRouter.delete("/:boardId/", DeleteBoard);
boardRouter.patch("/:boardId/", EditBoard);
boardRouter.post("/:boardId/tasks", PostTask);
boardRouter.post("/:boardId/tasks/:taskId/subtasks", SubTask);
boardRouter.get("/:boardId/tasks/:taskId/subtasks/", getSubtask);
boardRouter.patch("/:boardId/tasks/:taskId", EditTask);
boardRouter.delete("/:boardId/tasks/:taskId", DeteteTask);
boardRouter.patch("/:boardId/tasks/:taskId/subtasks/:subtaskId", EditSubtask);
boardRouter.delete(
  "/:boardId/tasks/:taskId/subtasks/:subtaskId",
  DeleteSubtask
);
module.exports = { boardRouter };
