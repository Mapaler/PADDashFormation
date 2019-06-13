智龙迷城车队阵型图制作工具 | Puzzle & Dragons Dash Formation Maker
======
这个工具可以帮助你方便的制作和分享车队阵型。  
This tool can help you easily create and share Dash Formation.

# 如何使用 | HOW TO USE
## 在哪里打开 | Where to open
* 快速使用在线版 | Fast Start  
http://mapaler.gitee.io/paddashformation/
* 或下载压缩包后使用火狐浏览器打开`index.html`。  
Or download ZIP, and open the `index.html` by Firefox.

# 翻译我 | TRANSLATE ME
## How to **Pull requests**
1. Click **Fork** In the page top right corner. Fork your own copy of this repository to your account.
1. Use Git to clone/pull repository locally for modification(How to modify please see below).
1. Use Git to commit and push changes to your repository on GitHub.
1. Go to the **[Pull requests](//github.com/puzzled-dragon/pad-helper/pulls)** page in the top middle of this repository, and click the **New pull request** button.
1. Click the **Compare Across Forks** button and select your fork, the page then displays the changes.
1. Click the **Create pull request** button and enter the details of the modification, create your pull request.
## Translate
1. Push your language info into `language-list.js`.  
This is a Object for a language list item.
    ```js
    {
        name:"English",i18n:"en",searchlist:["en","ja"],
        guideURL:"http://www.puzzledragonx.com/en/awokenskill.asp?n=$1"
    },
    ```
    * `name` is the name shown in the list.
    * `i18n` is the language-code for your language.
    * `searchlist` is the search candidate list string order when you search monster in edit window.  
    Currently only `ja`,`en`,`ko` languages.(See `monsters-info`)
    * `guideURL` is the language-code for your language.
1. Create your language's Localisation file `i18n.css` and `i18n.js`.

1. The original English webpage is `web/news/news.html` and `web/changelog/changelog.html`.
1. Copy the two HTML files to themselves folder, change filename to `news-your_language_tag.html` and `changelog-your_language_tag.html`, and then add to Git repository.
1. Translate your HTML files.
1. Change the `i18n_suffix` node value in your `strings.xml` to your language tag.
# Languages that are now supported
| Language Tag | Language variant |
| --- | --- |
| en | English |
| zh-rCN | 简体中文（中国） |
| zh-rHK | 繁體中文（香港） |
| zh-rTW | 繁體中文（台灣） |

### 智龙迷城官网 | Puzzle & Dragons Official Website
* [パズル＆ドラゴンズ](http://pad.gungho.jp)
* [龍族拼圖](https://pad.gungho.jp/hktw/pad/)
* [Puzzle & Dragons](https://www.puzzleanddragons.us/)
* [퍼즐앤드래곤](https://pad.neocyon.com/W/)