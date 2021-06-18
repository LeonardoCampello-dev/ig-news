import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { mocked } from 'ts-jest/utils';

import Post, {
  getStaticProps,
  PostPreviewProps as IPost
} from '../../pages/posts/preview/[slug]';
import { getPrismicClient } from '../../services/prismic';

jest.mock('next-auth/client');
jest.mock('next/router');
jest.mock('../../services/prismic');

const props: IPost = {
  post: {
    slug: 'react-testing-library',
    title: 'React Testing Library',
    content: '<p>Test your app</p>',
    updatedAt: 'June, 15'
  }
};

describe('🧪 Dado que estou na página PostPreview', () => {
  it('As informações são renderizadas corretamente', () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<Post post={props.post} />);

    expect(screen.getByText('React Testing Library')).toBeInTheDocument();
    expect(screen.getByText('Test your app')).toBeInTheDocument();
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument();
  });

  it('O usuário é redirecionado para o post completo caso ele já tenha uma inscrição', async () => {
    const useSessionMocked = mocked(useSession);
    const useRouterMocked = mocked(useRouter);

    const pushMock = jest.fn();

    useSessionMocked.mockReturnValueOnce([
      { activeSubscription: 'active-subscription' },
      false
    ]);

    useRouterMocked.mockReturnValueOnce({
      push: pushMock
    } as any);

    render(<Post post={props.post} />);

    expect(pushMock).toHaveBeenCalledWith('/posts/react-testing-library');
  });
  it('Os dados iniciais são carregados', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            {
              type: 'heading',
              text: 'React Testing Library'
            }
          ],
          content: [
            {
              type: 'paragraph',
              text: 'Prismic content'
            }
          ]
        },
        last_publication_date: '06-17-2021'
      })
    } as any);

    const response = await getStaticProps({ params: { slug: 'react-testing-library' } });

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'react-testing-library',
            title: 'React Testing Library',
            content: '<p>Prismic content</p>',
            updatedAt: '17 de junho de 2021'
          }
        }
      })
    );
  });
});
