const { Board, Task, Subtask } = require("../Model/board.model");
var jwt = require("jsonwebtoken");

const PostBoard = async (req, res) => {
  const payload = req.body;
  console.log(payload);
  try {
    const board = new Board(payload);
    await board.save();
    res
      .status(201)
      .send({ message: "Board Created successfully", board: board });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

const PostTask = async (req, res) => {
  const { boardId } = req.params;
  req.body.boardId = boardId;
  try {
    const board = await Board.findById({ _id: boardId });

    const task = new Task(req.body);
    await task.save();

    board.tasks.push(task._id);
    await board.save();

    res.send({ message: "Task added to the board", task });
  } catch (error) {
    res.send({ message: error.message });
  }
};

const SubTask = async (req, res) => {
  const { boardId, taskId } = req.params;
  const { title } = req.body;

  try {
    const task = await Task.findOne({ _id: taskId, boardId });

    for (let i = 0; i < title.length; i++) {
      const subtask = new Subtask({
        title: title[i],
        isCompleted: false,
        taskId,
      });

      await subtask.save();

      task.subtasks.push(subtask._id);
      await task.save();
    }

    res.status(201).send({ message: "Subtasks added succussfully" });
  } catch (error) {
    res.send({ message: error.message });
  }
};

const GetBoard = async (req, res) => {
  const token = req.headers.authorization;
  try {
    var decoded = jwt.verify(token, "mock15");

    const boards = await Board.find({ userID: decoded.userID });
    res.status(200).send({ boards });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

const GetBoardTask = async (req, res) => {
  const { boardId } = req.params;

  try {
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).send({ error: "Board not found" });
    }

    const tasks = await Task.find({ _id: { $in: board.tasks } });

    res.status(200).send(tasks);
  } catch (error) {
    res.status(400).send({ message: error.message + "Not Authorized" });
  }
};

const EditTask = async (req, res) => {
  const { taskId } = req.params;
  const { boardId } = req.params;
  const { title, description, status } = req.body;
  try {
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).send({ error: "Board not found" });
    }

    const task = await Task.findOne({ _id: taskId, boardId });

    if (title) {
      task.title = title;
    }
    if (description) {
      task.description = description;
    }
    if (status) {
      task.status = status;
    }

    await task.save();

    res.status(200).send({ message: "Task updated successfully", task });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

const getSubtask = async (req, res) => {
  const { taskId } = req.params;
  const { boardId } = req.params;
  try {
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).send({ error: "Board not found" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).send({ error: "Task not found" });
    }

    const subtasks = await Subtask.find({ _id: { $in: task.subtasks } });

    res.status(200).send(subtasks);
  } catch (error) {
    res.status(400).send({ message: error.message + "Not Authorized" });
  }
};

const EditSubtask = async (req, res) => {
  const { taskId } = req.params;
  const { subtaskId } = req.params;
  const { title, isCompleted } = req.body;
  try {
    const board = await Task.findById(taskId);
    if (!board) {
      return res.status(404).send({ error: "Task not found" });
    }

    const subtask = await Subtask.findOne({ _id: subtaskId, taskId });
    if (!subtask) {
      return res.status(404).json({ error: "Subtask not found in the task" });
    }
    if (title) {
      subtask.title = title;
    }
    if (isCompleted) {
      subtask.isCompleted = isCompleted;
    }

    await subtask.save();

    res.status(200).send({ message: "SubTask updated successfully", subtask });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
const DeleteSubtask = async (req, res) => {
  const { boardId, taskId, subtaskId } = req.params;
  try {
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).send({ error: "Board not found" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const subtask = await Subtask.findOne({ _id: subtaskId, taskId: taskId });

    if (!subtask) {
      return res.status(404).json({ error: "Subtask not found in the task" });
    }

    task.subtasks.pull(subtask._id);
    await task.save();

    await Subtask.deleteOne({ _id: subtaskId });

    res.status(200).send({ message: "Subtask deleted successfully" });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

const DeteteTask = async (req, res) => {
  const { boardId, taskId } = req.params;

  try {
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).send({ error: "Board not found" });
    }
    const task = await Task.findOne({ _id: taskId, boardId: boardId });
    if (!task) {
      return res.status(404).json({ error: "Task not found in the board" });
    }

    board.tasks.pull(task._id);
    await board.save();

    await Task.deleteOne({ _id: taskId });
    res.status(200).send({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

const DeleteBoard = async (req, res) => {
  const { boardId } = req.params;
  try {
    const board = await Board.findByIdAndDelete(boardId);

    res.status(200).send({ message: "Board deleted successfully" });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

const EditBoard = async (req, res) => {
  const { boardId } = req.params;
  const payload = req.body;
  try {
    const board = await Board.findByIdAndUpdate({ _id: boardId }, payload);
    res.status(201).send({ message: "Board updated successfully" });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
module.exports = {
  PostBoard,
  PostTask,
  SubTask,
  GetBoard,
  GetBoardTask,
  EditTask,
  getSubtask,
  EditSubtask,
  DeleteSubtask,
  DeteteTask,
  DeleteBoard,
  EditBoard,
};
