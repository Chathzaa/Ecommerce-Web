import React from 'react'
import Hero from '../components/Hero'
import Popular from '../components/Popular'
import Offer from '../components/Offer'
import NewCollection from '../components/NewCollection'
import NewsLetter from '../components/NewsLetter'

const Home = () => {
  return (
    <>
      <Hero />
      <Popular />
      <Offer />
      <NewCollection />
      <NewsLetter />
    </>
  )
}

export default Home