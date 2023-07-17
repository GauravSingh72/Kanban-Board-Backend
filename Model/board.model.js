const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema(
  {
    name: String,
    userId: String,
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  },
  {
    versionKey: false,
  }
);

const Board = mongoose.model("Board", boardSchema);

const taskSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    boardId: String,
    status: {
      type: String,
      enum: ["Todo", "Doing", "Done"],
      default: "Todo",
    },
    subtasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subtask" }],
  },
  {
    versionKey: false,
  }
);

const Task = mongoose.model("Task", taskSchema);

const subtaskSchema = new mongoose.Schema(
  {
    title: String,
    isCompleted: Boolean,
    taskId: String,
  },
  {
    versionKey: false,
  }
);

const Subtask = mongoose.model("Subtask", subtaskSchema);
module.exports = { Board, Task, Subtask };
