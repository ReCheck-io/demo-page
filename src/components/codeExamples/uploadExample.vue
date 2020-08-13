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
                
                // the userChainIdPubKey is the public encryption key. 

                  async upload(fileObj, userChainId, userChainIdPubKey) {
                return await e2e.store(fileObj, userChainId, userChainIdPubKey);
              },
            }

          END OF FILE  
          }

        // this chain.js file is then imported into the vue file

        <template>
        ...
                      <form enctype="multipart/form-data" novalidate v-if="isInitial || isSaving">
                        <div class="dropbox">
                          <input
                            type="file"
                            multiple
                            :name="uploadFieldName"
                            :disabled="isSaving"
                            @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length"
                            class="input-file"
                          />
        ...

        <div>
                        <h2>Result</h2>
                        <p>
                          When the transaction is successful the server will return as a result the blockchain id of the file
                          as well as the blockchain id of the identity that initiated the transaction, the address of our test user.
                        </p>
                        <p>
                          dataID:
                          <b>{{this.dataUploadRes}}</b>
                        </p>
                        <p>
                          userId:
                          <b>{{this.idUploadRes}}</b>
                        </p>
                      </div>
          </div>
        </template>

          <script>
           import chain from "pathToTheFile/chain.js"
            export default {
            data() {
              return {
              dataUploadRes: "",
              idUploadRes: "",
              }
            },
            methods: {
                   filesChange(fieldName, fileList) {
                      
                      // the token is important to make the API call
                      if (!this.token) {
                        return this.noToken();
                      }
                      
                      // choosing the blockchain and environment where we want our data stored
                      chain.setURLandNetwork("https://beta.recheck.io", "ae", this.token);
                     
                     // handle file changes
                      if (!fileList.length) return;
                      let splitFileName = fileList[0].name.split(".");
                     
                     // read as Binary so that it can be digested and crypted
                      const reader = new FileReader();
                      
                     // the uploading of the file has to happen in this async function 
                     // so that the file can be crypted and stored once it is being read as binary 
                      reader.onload = async (e) => {
                        this.$emit("load", e.target.result);
                        
                        //A String object in which each character in the string is treated as a byte of binary data
                        this.payload = btoa(e.target.result);
                        
                        let fileObj = {};
                        
                        //creating {} and preparing for the data to be stored
                    
                        fileObj.payload = this.payload;
                        (fileObj.dataName = splitFileName[0]),
                        (fileObj.dataExtension = "." + splitFileName[1]);
                        fileObj.category = "OTHER";
                        fileObj.keywords = " ";
                        
                        this.$root.$emit("progress_on");

                        this.uploadRes = await chain.upload(fileObj, this.address, this.publicEncKey)
                          .catch((err) => {
                            let i;
                            let text = "";
                            for (i = 0; i < err.length; i++) {
                              text += err[i].message.EN + " \n ";
                            }
                            alert(text);
                          });

                        if (this.uploadRes) {
                          // the recording on the blockchain needs some time, 
                          // the timeout is so that on the demo page the user is forced to wait before the next click
                      
                          setTimeout(function () {}, 10000);
                          alert("File has been uploaded");
                          this.dataUploadRes = this.uploadRes.dataId;
                          this.idUploadRes = this.uploadRes.userId;
                          this.$root.$emit("walletEvent");
                          this.$root.$emit("progress_off");
                        } else if (!this.uploadRes) {
                          this.$root.$emit("walletEvent");
                          this.$root.$emit("progress_off");
                        }
                      };
                      reader.readAsBinaryString(fileList[0]);
                    },
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
