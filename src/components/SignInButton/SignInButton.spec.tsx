import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';

import { useSession } from 'next-auth/client';

import { SignInButton } from '.';

jest.mock('next-auth/client');

describe('🧪 Dado que estou no componente SignInButon', () => {
  it('As informações são renderizadas corretamente quando o usuário NÃO está autenticado', () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<SignInButton />);

    expect(screen.getByText('Sign in with GitHub')).toBeInTheDocument();
  });

  it('As informações são renderizadas corretamente quando o usuário está autenticado', () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([
      {
        user: {
          name: 'LeonardoCampello-dev',
          email: 'leonardocampello.dev@gmail.com',
        },
        expires: 'expires',
      },
      false,
    ]);

    render(<SignInButton />);

    expect(screen.getByText('LeonardoCampello-dev')).toBeInTheDocument();
  });
});
