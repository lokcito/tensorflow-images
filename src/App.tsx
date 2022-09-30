import { Component, createSignal } from 'solid-js';
import * as mobilenet from "@tensorflow-models/mobilenet";
import "@tensorflow/tfjs";

const App: Component = () => {
  type Data = {
    className: string;
    probability: number;
  }[];
  const [result, setResult] = createSignal<Data>();
  const [load, setLoad] = createSignal(false);

  let randomString = () => {
    var chars = '01234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz'; 
    var stringlength = 5; /* could be 6 or 7, but takes forever because there are lots of dead images */
    var text = '';
    for (var i = 0; i < stringlength; i++) {
      var rnum = Math.floor(Math.random() * chars.length);
      text += chars.substring(rnum,rnum+1);
    }
     
    var source = 'https://i.imgur.com/' + text + '.jpg';
    
    var image = new Image();
    let img = document.getElementById("img") as HTMLImageElement | null;
    if ( img === null ) {
      return;
    }
    img.src = source;
  }

  return (
    <>
      <section class="container px-20 mx-auto">
        <div class="flex flex-col text-center w-full mb-6 mt-6">
          <h1 class="font-medium text-2xl">Reconcimiento de imagenes</h1>
        </div>
        <div class="flex">
          <div class="w-1/2 flex flex-col">
            <div class="mx-auto border-2 border-gray-200 p-10 rounded-lg">
              <div class="pb-3 text-center">
                <button class="bg-indigo-500 text-white rounded px-10"
                  onClick={async () => {
                    setLoad(!load());
                    const img = document.getElementById("img") as HTMLImageElement | null;
                    if ( img === null ) {
                      return;
                    }
                    // Load the model.
                    const model = await mobilenet.load();
                    // Classify the image.
                    const predictions = await model.classify(img);
                    
                    setLoad(!load());
                    if ( predictions ) {
                      setResult(predictions);
                    } else {
                      setResult([]);
                    }
                  }}
                >
                  Predecir
                </button>
              </div>
              <img id="img"  crossorigin='anonymous' class="w-full" src="https://i.imgur.com/BDDnWw4.jpeg" />
              <div class="pt-3 text-center">
                <button class="bg-indigo-500 text-white rounded px-10"
                  onClick={() => {
                    randomString();
                  }}
                >
                  Cambiar imagen
                </button>
              </div>
            </div>
          </div>
          <div class="w-1/2 flex flex-col">
            <div class="mx-auto w-full border-2 border-gray-200 p-10 rounded-lg flex-1">
              {load()?<h2 class="text-center text-xl">Analizando</h2>:<>
              <h2 class="text-center text-xl">Prediccion</h2>
              <div>
                { result()!.map(e => <li>{e.className}</li>) }
              </div></>}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default App;
