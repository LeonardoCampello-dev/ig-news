import { fireEvent, render, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/client';
import { mocked } from 'ts-jest/utils';

import { SubscribeButton } from '.';

jest.mock('next-auth/client');
jest.mock('next/router');

describe('🧪 Dado que estou no componente SignInButon', () => {
  it('As informações são renderizadas corretamente', () => {
    const useSessionMocked = mocked(useSession);

    /** Usuário não autenticado  */
    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<SubscribeButton />);

    expect(screen.getByText('Subscribe now')).toBeInTheDocument();
  });

  it('Quando o usuário não estiver autenticado ele será redirecionado para página de Sign In', () => {
    const useSessionMocked = mocked(useSession);

    /** Usuário não autenticado  */
    useSessionMocked.mockReturnValueOnce([null, false]);

    const signInMocked = mocked(signIn);

    render(<SubscribeButton />);

    const subscribeButton = screen.getByText('Subscribe now');

    fireEvent.click(subscribeButton);

    /** Chamada da função que redireciona para o signIn */
    expect(signInMocked).toHaveBeenCalled();
  });

  it('Quando o usuário estiver autenticado e possuir uma inscrição ativa ele será redirecionado para página de posts', () => {
    const useRouterMocked = mocked(useRouter);
    const useSessionMocked = mocked(useSession);

    const pushMock = jest.fn();

    /** Usuário autenticado e com uma inscrição ativa */
    useSessionMocked.mockReturnValueOnce([
      {
        user: {
          name: 'LeonardoCampello-dev',
          email: 'leonardocampello.dev@gmail.com'
        },
        activeSubscription: 'active-subscription',
        expires: 'expires'
      },
      false
    ]);

    /** Mock para o router.push() do Next.js */
    useRouterMocked.mockReturnValueOnce({
      push: pushMock
    } as any);

    render(<SubscribeButton />);

    const subscribeButton = screen.getByText('Subscribe now');

    fireEvent.click(subscribeButton);

    /** Chamada da função que redireciona o usuário para página de posts */
    expect(pushMock).toHaveBeenCalledWith('/posts');
  });
});
