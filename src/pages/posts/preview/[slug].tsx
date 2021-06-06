import { useEffect } from 'react';

import { GetStaticPaths, GetStaticProps } from 'next';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';

import Head from 'next/head';
import Link from 'next/link';

import { RichText } from 'prismic-dom';

import { getPrismicClient } from '../../../services/prismic';

import styles from '../post.module.scss';

interface PostPreviewProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  };
}

export default function PostPreview({ post }: PostPreviewProps) {
  const [session] = useSession();
  const router = useRouter();

  const { title, content, updatedAt, slug } = post;

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${slug}`);
    }
  }, [session]);

  return (
    <>
      <Head>
        <title>{title} | Ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{title}</h1>

          <time>{updatedAt}</time>

          <div
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: content }}
          />

          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href='/'>
              <a>Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    // only useful for building
    paths: [],
    // true | false | blocking
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();

  const response = await prismic.getByUID('post', String(slug), {});

  const { last_publication_date } = response;
  const { title, content } = response.data;

  const post = {
    slug,
    title: RichText.asText(title),
    content: RichText.asHtml(content.splice(0, 3)),
    updatedAt: new Date(last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
  };

  return {
    props: {
      post,
    },
    redirect: 60 * 30, // thirty minutes
  };
};
