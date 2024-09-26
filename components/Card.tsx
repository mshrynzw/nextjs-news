"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faYoutube } from "@fortawesome/free-brands-svg-icons"
import { faQ, faZ } from "@fortawesome/free-solid-svg-icons"
import { Article } from "@/types/article"
import { Element } from "@/types/element"
import { ElementYoutube } from "@/types/elementYoutube"

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

      const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
      const location = '36.2048,138.2529';
      const locationRadius = '500km';
      const q = "Next.js OR React OR Nuxt.js OR Vue OR Astro OR Hono OR AI";

      const url = new URL('https://www.googleapis.com/youtube/v3/search');
      url.searchParams.append('part', 'snippet');
      url.searchParams.append('q', q);
      url.searchParams.append('type', 'video');
      url.searchParams.append('order', 'date');
      // url.searchParams.append('i18nRegion', 'JP');
      url.searchParams.append('location', location);
      url.searchParams.append('locationRadius', locationRadius);
      url.searchParams.append('maxResults', '25');
      url.searchParams.append('key', apiKey as string);

      try {
        const response = await fetch(url.toString());
        if (!response.ok) {
          const errorData = await response.json();
          console.error('YouTube APIエラー:', errorData);
          throw new Error('YouTube APIリクエストが失敗しました');
        }
        const data = await response.json();
        const youtubeArticles: Article[] = []
        data.items.map((element: ElementYoutube) => {
          youtubeArticles.push(
            {
              id: element.id.videoId,
              type: "youtube",
              title: element.snippet.title,
              url: `https://www.youtube.com/watch?v=${element.id.videoId}`,
              updated_at: element.snippet.publishedAt,
            }
          )
        });
        setArticles(prevArticles => [...prevArticles, ...youtubeArticles]);
      } catch (error) {
        console.error('YouTube APIの検索中にエラーが発生しました:', error);
        return [];
      }
    }

    fetchArticles()
  }, [])

  return (
    <>
      {articles
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .map((article, index) => (
          <div className="w-full md:w-4/12 px-4 text-center" key={`${article.type}-${article.id}-${index}`}>
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
              <Link href={article.url} target="_blank">
                <div className="px-4 py-5 flex-auto">
                  {article.type === "qiita" ? (
                    <div
                      className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-lime-400">
                      <FontAwesomeIcon icon={faQ} />
                    </div>
                  ) : article.type === "zenn" ? (
                    <div
                      className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-cyan-400">
                      <FontAwesomeIcon icon={faZ} />
                    </div>
                  ) : (
                    <div
                      className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-red-400">
                      <FontAwesomeIcon icon={faYoutube} />
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