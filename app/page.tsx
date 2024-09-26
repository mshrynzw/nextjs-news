import Card from "@/components/Card"

const Home = () => {
  return (
    <>
      <main>
        <section className="py-20 bg-blueGray-200">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap">
              <Card/>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default Home