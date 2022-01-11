import { useEffect, useState } from 'react'
import { GetStaticProps, InferGetStaticPropsType, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { getPlant, getPlantList, getCategoryList, QueryStatus } from '@api'
import { Typography } from '@ui/Typography'
import { Grid } from '@ui/Grid'
import { Layout } from '@components/Layout'
import { RichText } from '@components/RichText'
import { AuthorCard } from '@components/AuthorCard'
import { PlantEntryInline } from '@components/PlantCollection'
import { Image } from '@components/Image'

type PlantEntryPageProps = {
  plant: Plant
  otherEntries: Plant[]
  categories: Category[]
}

type PathType = {
  params: {
    slug: string
  }
}

// Usando => SSR & GSP (server-side-rendering & get-static-props)
export const getStaticProps: GetStaticProps<PlantEntryPageProps> = async ({
  params,
  preview,
  locale,
}) => {
  // obtengo slug ss
  const slug = params?.slug
  // valido slug ss
  if (typeof slug !== 'string') {
    return { 
      notFound: true 
    }
  }
  // obtengo data
  try {
    const plant = await getPlant(slug, preview, locale)
    // Sidebar – This could be a single request since we are using GraphQL :)
    const otherEntries = await getPlantList({
      limit: 5,
    })
    const categories = await getCategoryList({ limit: 10 })
    // return props ss
    return {
      props: {
        plant,
        otherEntries,
        categories,
      },
      // Usando SSR & ISG (server-side-rendering & incremental-static-generation)
      revalidate: 5 * 60, // once every five minutes
    }
  } catch (e) {
    return {
      notFound: true,
    }
  }
}

// Usando => SSR (server-side-rendering)
export const getStaticPaths: GetStaticPaths = async () => {
  // Match home query.
  // @TODO how do we generate all of our pages if we don't know the number? 🤔
  const plantEntriesToGenerate = await getPlantList({ limit: 10 })

  const paths: PathType[] = plantEntriesToGenerate.map(({slug}) => ({
    params: {
      slug,
    },
  }))

  return {
    paths,    
    fallback: 'blocking', // wait until HTTP is done. Block until the server gets its data. Like in Server side rendering
    // fallback: true, // let the component handle it
    // fallback: false, // 404
  }
}

export default function PlantEntryPage({
  plant,
  otherEntries,
  categories,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  // Usando => CSR (client-side-rendering)
  const [status, setStatus] = useState<QueryStatus>('idle')
  const [_plant, setPlant] = useState<Plant | null>(null)
  const router = useRouter()
  // obtengo slug cs
  const slug = router.query.slug
  useEffect(() => {
    // valido slug
    if (typeof slug !== 'string' || !plant) {
      return
    }
    setStatus('loading')
    // obtengo data
    getPlant(slug)
      .then(data => {
        setPlant(data)
        setStatus('success')
      })
      .catch(err => {
        console.log(`error`, err)
        setStatus('error')
      })
  }, [slug])

  // valido FE
  if (status === 'loading' || status === 'idle') {
    return (
      <Layout>
        <main>
          Loading awesomeness..
        </main>
      </Layout>
    )
  }

  if (plant === null || status === 'error') {
    return (
      <Layout>
        <main>
          404, my friend
        </main>
      </Layout>
    )
  }
  // end example CSR

  // valido FE SSR (fallback: 'blocking')
  if (router.isFallback) {
    return (
      <Layout>
          <main>
            Loading awesomeness..
          </main>
      </Layout>
    )
  }


  return (
    <Layout>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8} lg={9} component="article">
          <figure>
            <Image
              width={952}
              aspectRatio="4:3"
              layout="intrinsic"
              src={plant.image.url}
              alt={plant.image.title}
            />
          </figure>
          <div className="px-12 pt-8">
            <Typography variant="h2">{plant.plantName}</Typography>
          </div>
          <div className="p-10">
            <RichText richText={plant.description} />
          </div>
        </Grid>
        <Grid item xs={12} md={4} lg={3} component="aside">
          <section>
            <Typography variant="h5" component="h3" className="mb-4">
              {'recentPosts'}
            </Typography>
            {otherEntries.map((plantEntry) => (
              <article className="mb-4" key={plantEntry.id}>
                <PlantEntryInline {...plantEntry} />
              </article>
            ))}
          </section>
          <section className="mt-10">
            <Typography variant="h5" component="h3" className="mb-4">
              {'categories'}
            </Typography>
            <ul className="list">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link passHref href={`/category/${category.slug}`}>
                    <Typography component="a" variant="h6">
                      {category.title}
                    </Typography>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </Grid>
      </Grid>
      <section className="my-4 border-t-2 border-b-2 border-gray-200 pt-12 pb-7">
        <AuthorCard {...plant.author} />
      </section>
    </Layout>
  )
}
