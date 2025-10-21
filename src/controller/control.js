import Task from '../model/taskModel.js';

export default class Control {
  postDocument = async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const newTodo = new Task({ userId, ...req.body });
      await newTodo.save();

      res.status(201).json({
        success: true,
        message: 'Todo added successfully',
        todo: newTodo,
      });
    } catch (err) {
      next(err);
    }
  };

  getDocuments = async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const { search, filter, priority } = req.query;
      const query = { userId };

      if (filter === 'completed') {
        query.isCompleted = true;
      } else if (filter === 'pending') {
        query.isCompleted = false;
      }

      if (priority === 'important') {
        query.isImportant = true;
      } else if (priority === 'normal') {
        query.isImportant = false;
      }

      if (search) {
        const regex = new RegExp(search, 'i');

        query.$or = [{ title: { $regex: regex } }, { tags: { $in: [regex] } }];
      }

      const tasks = await Task.find(query).sort({
        updatedAt: -1,
        createdAt: -1,
      });

      res.status(200).json(tasks);
    } catch (err) {
      next(err);
    }
  };

  getDocumentById = async (req, res, next) => {
    try {
      const task = await Task.findById(req.params.id);

      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      res.status(200).json(task);
    } catch (err) {
      next(err);
    }
  };

  updateDocument = async (req, res, next) => {
    try {
      const id = req.params.id;
      const userId = req.user.userId;
      const updatedTask = await Task.findByIdAndUpdate(
        { _id: id, userId },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedTask) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.status(200).json({
        success: 'success true',
        message: 'Todo updated successfully',
        task: updatedTask,
      });
    } catch (err) {
      next(err);
    }
  };

  deleteById = async (req, res, next) => {
    try {
      const deletedTask = await Task.findByIdAndDelete({
        _id: req.params.id,
        userId: req.user.userId,
      });

      if (!deletedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }

      res.status(200).json({
        success: 'success true',
        message: 'Task deleted successfully',
        todo: deletedTask,
      });
    } catch (err) {
      next(err);
    }
  };

  clearCompletedTasks = async (req, res, next) => {
    try {
      const userId = req.user.userId;

      await Task.deleteMany({ userId, isCompleted: 'true' });

      res
        .status(200)
        .json({ success: 'success true', message: 'cleared completed tasks' });
    } catch (err) {
      next(err);
    }
  };

  clearAllTasks = async (req, res, next) => {
    try {
      const userId = req.user.userId;

      await Task.deleteMany({ userId });

      res
        .status(200)
        .json({ success: 'success true', message: 'All tasks cleared' });
    } catch (err) {
      next(err);
    }
  };
}
