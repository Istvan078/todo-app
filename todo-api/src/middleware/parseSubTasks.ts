const parseSubtasks = (req: any, res: any, next: any) => {
  if (req.body && typeof req.body.subtasks === 'string') {
    try {
      req.body.subtasks = JSON.parse(req.body.subtasks);
    } catch {
      req.body.subtasks = [];
    }
  }

  next();
};

export default parseSubtasks;
