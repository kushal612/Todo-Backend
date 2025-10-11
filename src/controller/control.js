import Task from '../model/taskModel.js';

export default class Control {
  postDocument = async (req, res, next) => {
    try {
      const newTodo = await Task.create(req.body);

      res.status(201).json({
        message: 'Todo added successfully',
        todo: newTodo,
      });
    } catch (err) {
      next(err);
    }
  };

  getDocuments = async (req, res, next) => {
    try {
      const { search, filter, priority } = req.query;
      const query = {};

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

      let tasks = await Task.find(query);

      tasks = tasks.sort((a, b) => {
        const dateA = a.updatedAt || a.createdAt;
        const dateB = b.updatedAt || b.createdAt;
        return new Date(dateB) - new Date(dateA);
      });

      res.status(200).json(tasks);
    } catch (err) {
      next(err);
    }
  };

  getDocumentById = async (req, res, next) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) return res.status(404).json({ message: 'Task not found' });
      res.status(200).json(task);
    } catch (err) {
      next(err);
    }
  };

  updateDocument = async (req, res, next) => {
    try {
      const id = req.params.id;
      const updatedTask = await Task.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updatedTask) {
        const error = new Error(`Todo with id ${id} not found`);
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        message: 'Todo updated successfully',
        task: updatedTask,
      });
    } catch (err) {
      next(err);
    }
  };

  deleteById = async (req, res, next) => {
    try {
      const deletedTask = await Task.findByIdAndDelete(req.params.id);

      if (!deletedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }

      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
      next(err);
    }
  };

  clearCompletedTasks = async (req, res, next) => {
    try {
      await Task.deleteMany({ isCompleted: 'true' });

      res.status(200).json({ message: 'cleared completed tasks' });
    } catch (err) {
      next(err);
    }
  };

  clearAllTasks = async (req, res, next) => {
    try {
      await Task.deleteMany({});

      res.status(200).json({ message: 'All tasks cleared' });
    } catch (err) {
      next(err);
    }
  };
}
