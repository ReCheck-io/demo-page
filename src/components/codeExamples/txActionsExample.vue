<template>
  <div class="example">
    <div class="codemirror">
      <codemirror
        v-model="code" 
        :options="cmOption"
        @cursorActivity="onCmCursorActivity"
        @ready="onCmReady"
        @focus="onCmFocus"
        @blur="onCmBlur"
      />
    </div>
    <!-- <pre class="pre">{{ code }}</pre> -->
  </div>
</template>

<script>
  import dedent from 'dedent'
  import { codemirror } from 'vue-codemirror'

  // base style
  import 'codemirror/lib/codemirror.css'

  // theme css
  import 'codemirror/theme/base16-dark.css'

  // language
  import 'codemirror/mode/vue/vue.js'

  // active-line.js
  import 'codemirror/addon/selection/active-line.js'

  // styleSelectedText
  import 'codemirror/addon/selection/mark-selection.js'
  import 'codemirror/addon/search/searchcursor.js'

  // highlightSelectionMatches
  import 'codemirror/addon/scroll/annotatescrollbar.js'
  import 'codemirror/addon/search/matchesonscrollbar.js'
  import 'codemirror/addon/search/searchcursor.js'
  import 'codemirror/addon/search/match-highlighter.js'

  // keyMap
  import 'codemirror/mode/clike/clike.js'
  import 'codemirror/addon/edit/matchbrackets.js'
  import 'codemirror/addon/comment/comment.js'
  import 'codemirror/addon/dialog/dialog.js'
  import 'codemirror/addon/dialog/dialog.css'
  import 'codemirror/addon/search/searchcursor.js'
  import 'codemirror/addon/search/search.js'
  import 'codemirror/keymap/sublime.js'

  // foldGutter
  import 'codemirror/addon/fold/foldgutter.css'
  import 'codemirror/addon/fold/brace-fold.js'
  import 'codemirror/addon/fold/comment-fold.js'
  import 'codemirror/addon/fold/foldcode.js'
  import 'codemirror/addon/fold/foldgutter.js'
  import 'codemirror/addon/fold/indent-fold.js'
  import 'codemirror/addon/fold/markdown-fold.js'
  import 'codemirror/addon/fold/xml-fold.js'

  export default {
    name: 'codemirror-example-vue',
    title: 'Mode: text/x-vue & Theme: base16-dark',
    components: {
      codemirror
    },
    data() {
      return {
        code: dedent`
          // having a .js file to import the library

          chain.js {
          let e2e = require('recheck-clientjs-library')
          
          var wallet = null
          var walletShare = null
          var keyPair = null
          
          export default {
           
           async checkTx(dataChainID, userChainID){
                return await e2e.checkHash(dataChainID, userChainID)
              }
           
           }

          END OF FILE  
          }

        // this chain.js file is then imported into the vue file

        <template>
        <div v-if="transactions.length >0">
              <ul>
                <li v-for="tx in transactions.slice(1)" :key="tx.trailHash">
                  <span>Chain ID of the data</span>
                  <b>{{ tx.dataId }}</b>
                  <br />
                  <span>The Chain ID of the one who executed the transaction</span>
                  <b>{{ tx.executor }}</b>
                  <br />
                  <span>The recepient of the file (in this demo it will matter only about the sharing)</span>
                  <b>{{tx.recepient}}</b>
                  <br />
                  <span>The type of request executed</span>
                  <b>{{tx.requestType}}</b>
                  <br />
                  <span>The unique ID of the transaction</span>
                  <b>{{tx.trailHash}}</b>
                  <br />
                  <span>The timestamp of the transacition</span>
                  <b>{{tx.timestamp}}</b>
                  <br />
                  <br />
                </li>
              </ul>
            </div>
        </template>

          <script>
           import chain from "pathToTheFile/chain.js"
            export default {
            data() {
              return {
              transactions: [{}],
              }
            },
            methods: {
               async txHistory() {
                this.transactions = [{}];
                let pubAddrress = this.address.substring(3);
                
                let tx = await chain.checkTx(this.dataUploadRes, pubAddrress);
                
                for (let i = 0; i < tx.length; i++) {
                  let res = {};
                  let dataId = tx[i].dataId;
                  let executor = tx[i].executorId;
                  let recepient = tx[i].recepientId;
                  let requestType = tx[i].requestType;
                  let trailHash = tx[i].trailHash;
                  let timestamp = tx[i].txReceiptTimestamp;
                  res = {
                    dataId: dataId,
                    executor: executor,
                    recepient: recepient,
                    requestType: requestType,
                    trailHash: trailHash,
                    timestamp: timestamp,
                  };
                  this.transactions.push(res);
                }
                //because it has as first object an empty one. 
                if (this.transactions.length < 2) {
                  alert("transactions are still recording");
                }
              },
            }
          }

          ${'<\/script>'}

        `,
        cmOption: {
          tabSize: 4,
          foldGutter: true,
          styleActiveLine: true,
          lineNumbers: true,
          line: true,
          keyMap: "sublime",
          mode: 'text/x-vue',
          theme: 'base16-dark',
          extraKeys: {
            'F11'(cm) {
              cm.setOption("fullScreen", !cm.getOption("fullScreen"))
            },
            'Esc'(cm) {
              if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false)
            }
          }
        }
      }
    },
    methods: {
      onCmCursorActivity(codemirror) {
        console.debug('onCmCursorActivity', codemirror)
      },
      onCmReady(codemirror) {
        console.debug('onCmReady', codemirror)
      },
      onCmFocus(codemirror) {
        console.debug('onCmFocus', codemirror)
      },
      onCmBlur(codemirror) {
        console.debug('onCmBlur', codemirror)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .example {
    display: flex;
    height: 300px;

    .codemirror,
    .pre {
      text-align: left;
      width: 100%;
      height: 100%;
      margin: 0;
      overflow: auto;
    }

    .pre {
      display: block;
      padding: 1rem;
      font-size: small;
      line-height: 1.6;
      word-break: break-all;
      word-wrap: break-word;
    }
  }
</style>
