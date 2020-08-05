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

            <v-btn @click="instructions">About</v-btn>
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
        <div v-if="nextStep >0">
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
        </div>
        <div v-if="nextStep>1">
          <v-card v-if="pinned" height="500px" style="margin-top:1rem">
            <v-container fill-height fluid>
              <v-layout fill-height>
                <v-flex xs12 align-content-start align-end fill-height flexbox>
                  <h2>Upload a file that is less than 5 mb</h2>
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
                  </div>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </div>
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
        <div v-if="nextStep>2">
          <v-card style="margin-top:1rem" v-if="this.dataUploadRes">
            <v-container fill-height fluid>
              <v-layout fill-height>
                <v-flex>
                  <h2>Sharing a file to the second (another) user</h2>
                </v-flex>
              </v-layout>
            </v-container>
            <v-card-title>
              <div>
                By clicking the button you will share the file with the second user.
                You can then use our
                <a
                  href="https://play.google.com/store/apps/details?id=io.recheck.android"
                  target="_blank"
                >
                  <i>ReCheck app</i>
                </a>.
                Click on the "Recover identity" button. If you already have an identity, backup the phrase and then reset the identity. On the recovery input
                the phrase of the second user to see whether there is something in the account's inbox on
                <a
                  href="https://beta.recheck.io"
                  target="_blank"
                >https://beta.recheck.io</a>
                .
              </div>
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="share" dark color="green">Share file</v-btn>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </div>
        <!-- Sign -->
        <div v-if="nextStep > 3">
          <v-card style="margin-top:1rem" v-if="this.dataUploadRes">
            <v-container fill-height fluid>
              <v-layout fill-height>
                <v-flex>
                  <h2>Sign of the file</h2>
                </v-flex>
              </v-layout>
            </v-container>
            <v-card-title>
              <div>
                By clicking the button below you will be able to put the signature of the first user on the
                file. By doing that the user proves, authenticates or even vouch for the contents of the file and its content.2
              </div>
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="sign" dark color="green">Sign</v-btn>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </div>
        <!-- Tx History -->
        <div v-if="nextStep > 4">
          <v-card style="margin-top:1rem" v-if="this.dataUploadRes">
            <v-container fill-height fluid>
              <v-layout fill-height>
                <v-flex>
                  <h2>Transaction History of the file</h2>
                </v-flex>
              </v-layout>
            </v-container>
            <v-card-title>
              <div>Bear in mind that the transactions do need some time before they are recorded on the blockchain.</div>
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="txHistory" dark color="green">Transaction History</v-btn>
              <v-spacer />
            </v-card-actions>
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
          </v-card>
        </div>
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
    this.renderShareKeys();
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
      uploadRes: "",
      dataUploadRes: "",
      idUploadRes: "",
      shareRes: "",
      signRes: "",
      nextStep: 1,
      transactions: [{}],
    };
  },
  methods: {
    renderKeys() {
      if (this.pinned) {
        this.address = JSON.parse(localStorage.wallet).address;
        this.publicKey = JSON.parse(localStorage.wallet).publicKey;
        this.privateKey = JSON.parse(localStorage.wallet).secretKey;
        this.publicEncKey = JSON.parse(localStorage.wallet).publicEncKey;
        this.privateEncKey = JSON.parse(localStorage.wallet).secretEncKey;
        this.phrase = JSON.parse(localStorage.wallet).phrase;
      }
    },
    renderShareKeys() {
      if (this.pinnedShare) {
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
      }
    },
    hasAccount() {
      if (localStorage.wallet) {
        this.pinned = true;
      } else {
        this.pinned = false;
      }
    },
    noToken() {
      alert("You have to get a token to complete this action.");
      this.reset();
    },
    noUser() {
      alert("You need to get second identity to share to.");
    },
    clearWallet() {
      chain.clearWallet();
      this.address = "";
      this.publicKey = "";
      this.privateKey = "";
      this.publicEncKey = "";
      this.privateEncKey = "";
      this.phrase = "";
      this.pinned = false;
      this.nextStep = 1;
    },
    clearWalletShare() {
      chain.clearWalletShare();
      this.addressShare = "";
      this.publicKeyShare = "";
      this.privateKeyShare = "";
      this.publicEncKeyShare = "";
      this.privateEncKeyShare = "";
      this.phraseShare = "";
      this.pinnedShare = false;
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
      this.nextStep = 2;
      this.reset();
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
      await chain.requestForTokenShareIdentity(
        JSON.parse(localStorage.walletShare)
      );
      this.$root.$emit("walletEvent");
      this.$root.$emit("progress_off");
      this.$root.$emit("error_on", "Identity created successfully!", "green");
      this.token = "";
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
      await this.requestToken();
    },
    reset() {
      // reset form to initial state
      this.currentStatus = STATUS_INITIAL;
      this.uploadedFiles = [];
      this.uploadError = null;
    },
    async share() {
      if (!this.token) {
        return this.noToken();
      }
      if (!localStorage.walletShare) {
        return this.noUser();
      }
      if (!this.dataUploadRes || !this.address || !this.publicEncKey) {
        return "no";
      }
      let res = await chain
        .shareFile(
          this.dataUploadRes,
          this.addressShare,
          JSON.parse(localStorage.wallet)
        )
        .catch((err) => {
          let i;
          let text = "";
          for (i = 0; i < err.length; i++) {
            text += err[i].message.EN + " \n ";
          }
          alert(text);
        });
      if (res) {
        alert("Share has been successful!");
        this.nextStep = 4;
      }
    },

    async sign() {
      if (!this.token) {
        return this.noToken();
      }
      let pubAddrress = this.address.substring(3);
      let res = await chain
        .signFile(
          this.dataUploadRes,
          pubAddrress,
          JSON.parse(localStorage.wallet)
        )
        .catch((err) => {
          let i;
          let text = "";
          for (i = 0; i < err.length; i++) {
            text += err[i].message.EN + " \n ";
          }
          alert(text);
        });

      if (res) {
        alert("Sign has been successful!");
        this.nextStep = 5;
      }
    },

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
      if (this.transactions.length < 2) {
        alert("transactions are still recording");
      }
    },

    instructions() {
      alert(
        "Welcome to our Demo page. The flow is the following: First you have to create an identity it will show you the keys an identity possess and the secret phrase that is used for recovering the identity. Then you will have to get a token in order to upload a file to the blockchain. Next you will want to share this file with someone, that means that you will have to create a second account to share to. There are two more options 'Share' and 'Sign'. Signing means that you validate the file to be authentic. You can then use the phrases of both identities and check the transactions in https://beta.recheck.io. Thank you for your time."
      );
    },

    filesChange(fieldName, fileList) {
      this.reset();
      if (!this.token) {
        return this.noToken();
      }
      chain.setURLandNetwork("https://beta.recheck.io", "ae", this.token);
      // handle file changes
      if (!fileList.length) return;
      let splitFileName = fileList[0].name.split(".");
      // readasBinary
      const reader = new FileReader();
      reader.onload = async (e) => {
        this.$emit("load", e.target.result);
        this.payload = btoa(e.target.result);
        let fileObj = {};
        fileObj.payload = this.payload;
        (fileObj.dataName = splitFileName[0]),
          (fileObj.dataExtension = "." + splitFileName[1]);
        fileObj.category = "OTHER";
        fileObj.keywords = " ";
        this.$root.$emit("progress_on");
        this.uploadRes = await chain
          .upload(fileObj, this.address, this.publicEncKey)
          .catch((err) => {
            let i;
            let text = "";
            for (i = 0; i < err.length; i++) {
              text += err[i].message.EN + " \n ";
            }
            alert(text);
          });
        if (this.uploadRes) {
          setTimeout(function () {}, 10000);
          alert("File has been uploaded");
          this.dataUploadRes = this.uploadRes.dataId;
          this.idUploadRes = this.uploadRes.userId;
          this.nextStep = 3;
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
