import Head from 'next/head';
import { GetStaticProps } from 'next';

import Prismic from '@prismicio/client';
import { getPrismicClient } from '../../services/prismic';

import { RichText } from 'prismic-dom';

import styles from './styles.module.scss';

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
};

interface PostsProps {
  posts: Post[];
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post) => {
            const { slug, title, excerpt, updatedAt } = post;

            return (
              <a key={slug} href='#'>
                <time>{updatedAt}</time>

                <strong>{title}</strong>

                <p>{excerpt}</p>
              </a>
            );
          })}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      fetch: ['post.title', 'post.content'],
      pageSize: 100,
    }
  );

  const posts = response.results.map((post) => {
    const { uid, data, last_publication_date } = post;
    const { title, content } = data;

    return {
      slug: uid,
      title: RichText.asText(title),
      excerpt:
        content.find((content) => content.type === 'paragraph')?.text ?? '',
      updatedAt: new Date(last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
    };
  });

  return {
    props: {
      posts,
    },
  };
};
