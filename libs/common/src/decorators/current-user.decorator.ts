import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../models';

const getCurrentUserByContext = (context: ExecutionContext): User | null => {
  const type = context.getType();
  if (type === 'http' || type === 'rpc') {
    return context.switchToHttp().getRequest<{ user: User }>().user;
  }

  // For other contexts, such as GraphQL, we can access the user from the context directly
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const user = context.getArgs()[2]?.req?.headers?.user;
  if (user && typeof user === 'string') {
    return JSON.parse(user) as User;
  }

  return null;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
