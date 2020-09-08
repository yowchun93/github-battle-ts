import React, {useState, useEffect} from 'react'

interface GithubRepo {
  name: string,
  owner: Owner,
  html_url: string,
  stargazers_count: string
}

interface Owner {
  login: string,
  avatar_url: string
}

// { 'All': Array<{}>, 'Ruby': Array<{}>, 'Javascript': Array<{}>}
interface Repos {
  [key: string]: Array<GithubRepo>
}

// declare a Repo interface or leave it as Any
// Promise<Any>
const fetchPopularRepos = (language: string): Promise<Array<GithubRepo>> => {
  // type inference
  const endpoint = window.encodeURI(`https://api.github.com/search/repositories?q=stars:>1+language:${language}&sort=stars&order=desc&type=Repositories`)

  // i probably need to declare type of data here.
  return fetch(endpoint)
    .then((res) => res.json())
    .then((data) => {
      if(!data.items) {
        throw new Error(data.message)
      }
      return data.items as Array<GithubRepo>
    })
}

const Popular: React.FC<{}> = () => {
  const [selectedLangauge, setLanguage] = useState('All')
  const [repos, setRepos] = useState<Repos>({})

  const languages: Array<string> = ['All', 'Ruby', 'Javascript']

  // let's do useEffect first
  useEffect(() => {
    fetchPopularRepos(selectedLangauge)
      .then((data: Array<GithubRepo>) => {
        setRepos({
          ...repos,
          [selectedLangauge]: data
        })
      })
  }, [selectedLangauge])

  console.log(repos[selectedLangauge])

  return (
    <React.Fragment>
      <ul className="flex-center">
        {
          languages.map((language) => (
            <li key={language}>
              <button
                className='btn-clear nav-link'
                onClick={() => setLanguage(language) }
                style={ language == selectedLangauge ? { color: 'rgb(187, 46, 31)' } : undefined }
                >
                {language}
              </button>
            </li>
          ))
        }
      </ul>
    </React.Fragment>
  )
}

export default Popular;