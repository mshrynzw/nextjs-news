import Card from "@/components/Card"

const Home = () => {
  return (
    <>
      <main>
        <section className="bg-blueGray-200">
          <div className="container mx-auto p-4">
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