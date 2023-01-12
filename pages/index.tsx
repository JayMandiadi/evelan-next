import { useEffect, useState, useTransition } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

interface IResponse<T> {
  page: number
  per_page: number
  data: T
  total: number
  total_pages: number
  support: ISupportData
}

interface IUser {
  id: number
  email: string
  first_name: string
  last_name: string
  avatar: string
}

type ISupportData = {
  url: string,
  text: string
}

type Props = IResponse<IUser[]>


function Home({ data, total_pages, page: initialPage }: Props) {
  const [page, setPage] = useState<number>(initialPage)
  const [totalPages, setTotalPages] = useState<number>(total_pages)
  const [users, setUsers] = useState<IUser[]>(data)
  const [isFetching, setIsFetching] = useState(false);

  return (
    <>
      <Head>
        <title>Evelan Test</title>
        <meta name="description" content="Evelan test task" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="google" content="notranslate" key="notranslate" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.description}>
          <div className={styles.user_grid}>
            {users.map((user: IUser) => (
              <div className={styles.user_card} key={user.id}>
                <Image alt="user avatar" src={user.avatar} width={30} height={30} style={{borderRadius: "30px"}} />
                <p style={inter.style}>{user.id}</p>
                <p style={inter.style}>{user.email}</p>
                <p style={inter.style}>
                  {user.first_name} {user.last_name}
                </p>
              </div>
            ))}
          </div>
          <button onClick={fetchUsers} disabled={isFetching || totalPages === page}>Load more</button>
        </div>
      </main>
    </>
  )

  async function fetchUsers() {
    setIsFetching(true);

    const url = new URL(`https://reqres.in/api/users?page=${page + 1}`)

    const res = await fetch(url);
    const list = await res.json() as IResponse<IUser[]>
    setUsers([...users, ...list.data])
    setPage(page + 1)
    list.total_pages !== totalPages && setTotalPages(list.total_pages)

    setIsFetching(false);
  }
}

export async function getStaticProps() {
  const url = new URL(`https://reqres.in/api/users?page=1`)

  const res = await fetch(url)
  const list = await res.json() as IResponse<IUser[]>

  return {
    props: list,
  }
}

export default Home;