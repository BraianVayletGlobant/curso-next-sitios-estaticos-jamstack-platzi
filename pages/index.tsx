import { useEffect, useState } from 'react'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { getPlantList } from '@api'
import { Layout } from '@components/Layout'
import { PlantCollection } from '@components/PlantCollection'
import { Hero } from '@components/Hero'
import { Authors } from '@components/Authors'

/*
 * NOTA: Para este ejemplo dejamos tanto la version csr como la ssr. Usar solo 1 de las 2.
 */

export default function Home({ plants }: InferGetStaticPropsType<typeof getStaticProps>) {
  
  // Usando => CDR (client-side-rendering)
  const [data, setData] = useState<Plant[]>([])
  useEffect(() => {
    getPlantList({limit: 5})
      .then(setData)
      .catch(console.log)
  }, [])
  useEffect(() => console.log(`data:CSR`, data), [data])
  
  
  return (
    <Layout>
      <Hero {...plants[0]} className="mb-20" />
      <Authors className="mb-10" />
      <PlantCollection
        plants={plants.slice(1, 3)}
        variant="vertical"
        className="mb-24"
      />
      <PlantCollection
        plants={plants.length > 8 ? plants.slice(3, 9) : plants}
        variant="square"
      />
    </Layout>
  )
}

// Usando => SSR & GSP (server-side-rendering & get-static-props)
type HomeProps = { plants: Plant[]}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  let plants: Plant[] = []
  try {
    plants = await getPlantList({limit: 10})    
  } catch (error) {
    console.log(`error`, error)
  }
  return {
    props: {
      plants
    },
    // Usando SSR & ISG (server-side-rendering & incremental-static-generation)
    revalidate: 5 * 60 // revalidate nos permite elegir cada cuanto tiempo hacer un refresh de la pagina. Ej 5 * 60 => 5 min
  }
}