<template>
  <v-container scrollable>
    <v-layout scrollable>
      <v-flex xs12>
        <v-card color="grey lighten-4" flat tile>
          <v-toolbar dense>
            <v-app-bar-nav-icon></v-app-bar-nav-icon>

            <v-toolbar-title>ReCheck services demo page</v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn href="https://beta.recheck.io" target="_blank">beta GUI</v-btn>

            <v-btn href="https://github.com/ReCheck-io" target="_blank">Github</v-btn>
          </v-toolbar>
        </v-card>
        <v-card>
          <v-container fill-height fluid>
            <v-layout fill-height>
              <v-flex>
                <h2>Generating Keys</h2>
              </v-flex>
            </v-layout>
          </v-container>
          <v-card-title v-if="!pinned">
            <div>Here you can generate a new set of keys and see their details</div>
          </v-card-title>
          <v-card-title v-if="pinned">
            <div class="textLeft">
              <span>Your initals and keys</span>
              <ul>
                <li>
                  publicAddress and blockchain ID:
                  <strong>{{this.address}}</strong>
                </li>
                <li>
                  publicKey (being public address in some cases):
                  <strong>{{this.publicKey}}</strong>
                </li>
                <li>
                  privateKey:
                  <strong>{{this.privateKey}}</strong>
                </li>
                <li>
                  publicEncryptionKey:
                  <strong>{{this.publicEncKey}}</strong>
                </li>
                <li>
                  privateEncryptionKey:
                  <strong>{{this.privateEncKey}}</strong>
                </li>
                <li>
                  And the phrase that you have to always keep safe somewhere
                  <br />phrase:
                  <strong>{{this.phrase}}</strong>
                </li>
              </ul>
            </div>
          </v-card-title>
          <v-card-actions v-if="!pinned">
            <v-spacer></v-spacer>
            <v-btn @click="createNewIdentity" dark color="green">Create identity</v-btn>
            <v-spacer />
          </v-card-actions>
          <v-card-actions v-if="pinned">
            <v-spacer></v-spacer>
            <v-btn @click="clearWallet" dark color="red">Reset identity</v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card>
        <v-card v-if="pinned" style="margin-top:1rem">
          <v-container fill-height fluid>
            <v-layout fill-height>
              <v-flex>
                <h2>Request for a token</h2>
              </v-flex>
            </v-layout>
          </v-container>
          <v-card-title v-if="pinned">
            <div class="textLeft">
              <p>The token is needed for requesting queries from the backend</p>
              <p v-if="this.token">
                Your token is
                <strong>{{this.token}}</strong>
              </p>
            </div>
          </v-card-title>
          <v-card-actions v-if="pinned">
            <v-spacer></v-spacer>
            <v-btn @click="requestToken" dark color="green">Get Token</v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card>
        <v-card v-if="pinned" height="400px" style="margin-top:1rem">
          <v-container fill-height fluid>
            <v-layout fill-height>
              <v-flex xs12 align-content-start align-end fill-height flexbox>
                <h2>Upload a file</h2>
                <div>
                  <div class="container">
                    <!--UPLOAD-->
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
                      </div>
                      <div>
                        <p v-if="isInitial">
                          Drag your file(s) here to begin
                          <br />or click to browse
                        </p>
                        <p v-if="isSaving">Uploading {{ fileCount }} files...</p>
                      </div>
                    </form>
                    <!--SUCCESS-->
                    <div v-if="isSuccess">
                      <h2>Uploaded {{ uploadedFiles.length }} file(s) successfully.</h2>
                      <p>
                        <a href="javascript:void(0)" @click="reset()">Upload again</a>
                      </p>
                      <ul class="list-unstyled">
                        <li v-for="item in uploadedFiles" v-bind:key="item">
                          <img
                            :src="item.url"
                            class="img-responsive img-thumbnail"
                            :alt="item.originalName"
                          />
                        </li>
                      </ul>
                    </div>
                    <!--FAILED-->
                    <div v-if="isFailed">
                      <h2>Uploaded failed.</h2>
                      <p>
                        <a href="javascript:void(0)" @click="reset()">Try again</a>
                      </p>
                      <pre>{{ uploadError }}</pre>
                    </div>
                  </div>
                </div>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
        <v-card style="margin-top:1rem">
          <v-container fill-height fluid>
            <v-layout fill-height>
              <v-flex>
                <h2>Generating keys for second user</h2>
              </v-flex>
            </v-layout>
          </v-container>
          <v-card-title v-if="!pinnedShare">
            <div>Here you can generate a new set of keys and see publicAddress and phrase.</div>
          </v-card-title>
          <v-card-title v-if="pinnedShare">
            <div class="textLeft">
              <span>
                Public address and phrase so that you can share to that account and then enter
                <a
                  href="https://beta.recheck.io"
                  target="_blank"
                >https://beta.recheck.io</a> with the mobile app to see if the share has been successful.
                As well as the behaviour.
              </span>
              <ul>
                <li>
                  publicAddress and blockchain ID:
                  <strong>{{this.addressShare}}</strong>
                </li>
                <li>
                  And the phrase that you have to always keep safe somewhere
                  <br />phrase:
                  <strong>{{this.phraseShare}}</strong>
                </li>
              </ul>
            </div>
          </v-card-title>
          <v-card-actions v-if="!pinnedShare">
            <v-spacer></v-spacer>
            <v-btn @click="createNewShareIdentity" dark color="green">Create identity</v-btn>
            <v-spacer />
          </v-card-actions>
          <v-card-actions v-if="pinnedShare">
            <v-spacer></v-spacer>
            <v-btn @click="clearWalletShare" dark color="red">Reset identity</v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import chain from "../chain";

const STATUS_INITIAL = 0,
  STATUS_SAVING = 1,
  STATUS_SUCCESS = 2,
  STATUS_FAILED = 3;
export default {
  mounted() {
    this.hasAccount();
    this.hasShareAccount();
    this.reset();
    this.renderKeys();
  },
  data() {
    return {
      pinned: false,
      pinnedShare: false,
      address: "",
      publicKey: "",
      publicEncKey: "",
      privateKey: "",
      privateEncKey: "",
      phrase: "",
      addressShare: "",
      publicKeyShare: "",
      publicEncKeyShare: "",
      privateKeyShare: "",
      privateEncKeyShare: "",
      phraseShare: "",
      uploadedFiles: [],
      uploadError: null,
      currentStatus: null,
      uploadFieldName: "photos",
      challenge: "",
      token: "",
      payload: "",
      category: "",
      name: "",
      extention: "",
    };
  },
  methods: {
    renderKeys() {
      this.address = JSON.parse(localStorage.wallet).address;
      this.publicKey = JSON.parse(localStorage.wallet).publicKey;
      this.privateKey = JSON.parse(localStorage.wallet).secretKey;
      this.publicEncKey = JSON.parse(localStorage.wallet).publicEncKey;
      this.privateEncKey = JSON.parse(localStorage.wallet).secretEncKey;
      this.phrase = JSON.parse(localStorage.wallet).phrase;
      this.addressShare = JSON.parse(localStorage.walletShare).address;
      this.publicKeyShare = JSON.parse(localStorage.walletShare).publicKey;
      this.privateKeyShare = JSON.parse(localStorage.walletShare).secretKey;
      this.publicEncKeyShare = JSON.parse(
        localStorage.walletShare
      ).publicEncKey;
      this.privateEncKeyShare = JSON.parse(
        localStorage.walletShare
      ).secretEncKey;
      this.phraseShare = JSON.parse(localStorage.walletShare).phrase;
    },
    hasAccount() {
      if (localStorage.wallet) {
        this.pinned = true;
      } else {
        this.pinned = false;
      }
    },
    clearWallet() {
      chain.clearWallet();
    },
    clearWalletShare() {
      chain.clearWalletShare();
    },

    hasShareAccount() {
      if (localStorage.walletShare) {
        this.pinnedShare = true;
      } else {
        this.pinnedShare = false;
      }
    },

    async requestToken() {
      await chain.requestForToken(JSON.parse(localStorage.wallet));
      this.token = localStorage.lastRtnToken;
    },

    async createNewIdentity() {
      this.$root.$emit("progress_on");
      await chain.getKeys();
      this.pinned = true;
      this.$root.$emit("walletEvent");
      this.$root.$emit("progress_off");
      this.$root.$emit("error_on", "Identity created successfully!", "green");

      this.address = JSON.parse(localStorage.wallet).address;
      this.publicKey = JSON.parse(localStorage.wallet).publicKey;
      this.privateKey = JSON.parse(localStorage.wallet).secretKey;
      this.publicEncKey = JSON.parse(localStorage.wallet).publicEncKey;
      this.privateEncKey = JSON.parse(localStorage.wallet).secretEncKey;
      this.phrase = JSON.parse(localStorage.wallet).phrase;
    },

    async createNewShareIdentity() {
      this.$root.$emit("progress_on");
      await chain.getKeysShare();
      this.pinnedShare = true;
      this.$root.$emit("walletEvent");
      this.$root.$emit("progress_off");
      this.$root.$emit("error_on", "Identity created successfully!", "green");

      this.addressShare = JSON.parse(localStorage.walletShare).address;
      this.publicKeyShare = JSON.parse(localStorage.walletShare).publicKey;
      this.privateKeyShare = JSON.parse(localStorage.walletShare).secretKey;
      this.publicEncKeyShare = JSON.parse(
        localStorage.walletShare
      ).publicEncKey;
      this.privateEncKeyShare = JSON.parse(
        localStorage.walletShare
      ).secretEncKey;
      this.phraseShare = JSON.parse(localStorage.walletShare).phrase;
    },
    reset() {
      // reset form to initial state
      this.currentStatus = STATUS_INITIAL;
      this.uploadedFiles = [];
      this.uploadError = null;
    },
    filesChange(fieldName, fileList) {
      chain.setURLandNetwork("https://beta.recheck.io", "ae", this.token);
      // handle file changes
      if (!fileList.length) return;
      let splitFileName = fileList[0].name.split(".");
      // readasBinary
      const reader = new FileReader();
      reader.onload = (e) => {
        this.$emit("load", e.target.result);
        this.payload = btoa(e.target.result);
        let fileObj = {};
        fileObj.payload = this.payload;
        (fileObj.dataName = splitFileName[0]),
          (fileObj.dataExtension = "." + splitFileName[1]);
        fileObj.category = "OTHER";
        fileObj.keywords = " ";

        chain.upload(fileObj, this.address, this.publicEncKey);
      };
      reader.readAsBinaryString(fileList[0]);
    },
  },
  computed: {
    isInitial() {
      return this.currentStatus === STATUS_INITIAL;
    },
    isSaving() {
      return this.currentStatus === STATUS_SAVING;
    },
    isSuccess() {
      return this.currentStatus === STATUS_SUCCESS;
    },
    isFailed() {
      return this.currentStatus === STATUS_FAILED;
    },
  },
};
</script>

<style scoped>
.spaced {
  margin-top: 10rem;
  margin-bottom: 1rem;
  margin-left: 1rem;
  margin-right: 1rem;
}
a {
  text-decoration: none;
}

.textLeft {
  text-align: left;
}

li {
  font-size: 15px;
  padding: 4px;
}

.input-file {
  opacity: 100; /* invisible but it's there! */
  width: 100%;
  height: 200px;
  position: relative;
  cursor: pointer;
}

.dropbox:hover {
  background: lightblue; /* when mouse over to the drop zone, change color */
}
</style>
