import {ServerCache} from "@/usehooks/useCache";

(window as any).global = window;

import ReactDOM from "react-dom";
import {BrowserRouter} from "react-router-dom";
import App from "./views";
import {fontResize} from "./utils/fontResize";
import rewriteFixed from "./utils/rewriteFixed";
import {ProvideAuth} from "./usehooks/useAuth";
import React from "react";
import "./main.css"
import {Provider} from "react-redux";
import store from "./redux/store";
import {toast, ToastContainer} from "react-toastify";
import {Buffer} from 'buffer';
import "react-toastify/dist/ReactToastify.css";
import "./i18n"
import {ImartAuthProvider} from "@mix-labs/wallet";


//@ts-ignore
window.Buffer = Buffer;
toast.configure();
fontResize();
rewriteFixed();
(window as any)["global"] = window;
window.React = React;

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <ProvideAuth>
        <ServerCache>
          <ImartAuthProvider>
            <App/>
          </ImartAuthProvider>
        </ServerCache>
      </ProvideAuth>
      <ToastContainer
        style={{top: "10px", width: "auto", minWidth: "20rem"}}
        position="top-center"
        // autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        theme="light"
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover
      />
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
);
