import { systemSetting } from '../configs/systemSetting';

export const checkTaskTriggerKeyInHeader = (req, res, next) => {
  const key = systemSetting.taskTriggerKey;
  if (req.headers.authorization !== key) {
    res.status(401).send('Unauthorized');
    return;
  }
  next();
};
