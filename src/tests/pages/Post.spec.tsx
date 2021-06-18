import { render, screen } from '@testing-library/react';

import { getPrismicClient } from '../../services/prismic';
import { getSession } from 'next-auth/client';

import { mocked } from 'ts-jest/utils';

import Post, { getServerSideProps, PostProps as IPost } from '../../pages/posts/[slug]';

jest.mock('next-auth/client');
jest.mock('../../services/prismic');

const props: IPost = {
  post: {
    slug: 'react-testing-library',
    title: 'React Testing Library',
    content: '<p>Test your app</p>',
    updatedAt: 'June, 15'
  }
};

describe('🧪 Dado que estou na página Post', () => {
  it('As informações são renderizadas corretamente', () => {
    render(<Post post={props.post} />);

    expect(screen.getByText('React Testing Library')).toBeInTheDocument();
    expect(screen.getByText('Test your app')).toBeInTheDocument();
  });

  it('Redirecionar o usuário se nenhuma inscrição for encontrada', async () => {
    const getSessionMocked = mocked(getSession);

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: null
    });

    const response = await getServerSideProps({
      params: { slug: 'react-testing-library' }
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({ destination: '/' })
      })
    );
  });
  it('Os dados iniciais são carregados', async () => {
    const getSessionMocked = mocked(getSession);
    const getPrismicClientMocked = mocked(getPrismicClient);

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'active-subscription'
    });

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

    const response = await getServerSideProps({
      params: { slug: 'react-testing-library' }
    } as any);

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
