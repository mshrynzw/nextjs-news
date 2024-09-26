"use client"

import React, {useState, useEffect} from "react"
import axios from "axios"
import Link from "next/link"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faQ, faZ} from "@fortawesome/free-solid-svg-icons"
import {Article} from "@/types/article"
import {Element} from "@/types/element"

const Cards = () => {
  const [articles, setArticles] = useState<Article[]>([])

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("https://qiita.com/api/v2/items?page=1&per_page=20&query=Next.js OR React OR Nuxt.js OR Vue OR Astro OR Hono OR AI")
        const qiitaArticles: Article[] = []
        response.data.map((element: Element) => {
          qiitaArticles.push(
            {
              id: element.id,
              type: "qiita",
              title: element.title,
              url: element.url,
              updated_at: element.updated_at,
            }
          )
        })
        setArticles(qiitaArticles)
      } catch (error) {
        console.error("Qiita APIからのデータ取得に失敗しました:", error)
      }

      try {
        const response = await axios.get('/api/getZenn');
        const zennArticles: Article[] = []
        response.data.articles.map((element: Element) => {
          zennArticles.push(
            {
              id: element.id,
              type: "zenn",
              title: element.title,
              url: `https://zenn.dev${element.path}`,
              updated_at: element.published_at,
            }
          )
        })
        setArticles(prevArticles => [...prevArticles, ...zennArticles])
      } catch (error) {
        console.error("Zenn APIからのデータ取得に失敗しました:", error)
      }

    }

    fetchArticles()
  }, [])

  return (
    <>
      {articles
        .sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime())
        .map((article, index) => (
        <div className="w-full md:w-4/12 px-4 text-center" key={`${article.type}-${article.id}-${index}`}>
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
            <Link href={article.url} target="_blank">
              <div className="px-4 py-5 flex-auto">
                {article.type === "qiita" ? (
                  <div
                    className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-lime-400">
                    <FontAwesomeIcon icon={faQ}/>
                  </div>
                ) : (
                  <div
                    className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-cyan-400">
                    <FontAwesomeIcon icon={faZ}/>
                  </div>
                )}
                <h6 className="text-xl font-semibold">{article.title}</h6>
              </div>
            </Link>
          </div>
        </div>
      ))}
    </>
  )
}

export default Cards