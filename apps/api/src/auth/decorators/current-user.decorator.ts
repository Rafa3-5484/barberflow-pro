import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) return null;

    if (data) {
      const keys = data.split('.');
      let value = user;
      for (const key of keys) {
        value = value?.[key];
      }
      return value;
    }

    return user;
  },
);
