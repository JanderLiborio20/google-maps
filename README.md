<p align="center">
  <img src="https://github.com/user-attachments/assets/71d6d8be-0860-49a4-8a5e-a49df3ef0afe" width="300" alt="Icone de Mapa com um Pin">
</p>

---

<div id='introducao'>

O **Google-maps** é uma aplicação voltada para localização e cadastro de pontos no maps, usando o google maps api.

</div>

## Tópicos

- [Introdução](#introducao)
- [Instalar e rodar o projeto localmente](#instalacao)
- [Stack utilizada](#stack_utilizada)
- [Demonstração](#demonstração)
- [Roadmap](#roadmap)
- [Aprendizados](#aprendizados)
- [Contatos](#contatos)

<div id='instalacao'>

## Instalando e rodando o projeto localmente:

Para rodar o **Google-maps** em sua máquina é bem simples.

Você precisa ter instalado:

- Node.js v18
- Yarn ou NPM para a instalação dos pacotes (projeto desenvolvido com Yarn)

Para a instalação dos pacotes você deve entrar em cada pasta individualmente
e rodar o comando `yarn install`, pois neste projeto temos o _backend_ e o _frontend_.

Navegue para `../api` e rode no terminal o comando:

```bash
npm install
```

Repita esse passo para `../frontEnd`.

### Rotas

Lembre-se de alterar as rotas da aplicação nos arquivos:

</div>

E mais um detalhe, a porta padrão do _frontend_ foi definida para `:3000`, e do _backend_ para `:3001`.

Pronto, agora você está preparado para utilizar esta aplicação.
Para iniciar o _backend_ basta rodar `npm dev`.
E para iniciar o _frontend_ basta rodar `npm dev` em sua respectiva pasta.

</div>

<div id='stack_utilizada'>
<h2>Stack utilizada</h2>

**Front-end:**

<ul id="frontend-stack">
	<li>React</li>
	<li>Styled-Components</li>
	<li>React-google-maps-api</li>
</ul>

**Back-end:**

<ul id="backend-stack">
	<li>Nestjs</li>
	<li>Prisma</li>
</ul>

> Em ambos foram utilizados o EditorConfig e Eslint para o desenvolvimento.

</div>

<div id='demonstração'>
<h2>Demonstração</h2>

<p align="center">
  <img width="600" height="450" src="https://github.com/user-attachments/assets/0cfee5cb-ca33-4618-a82a-c33994ad2b74"/>  
</p>

<div id='aprendizados'>
<h2>Aprendizados</h2>

Neste projeto aprendemos a utilizar muito bem o _React_, e principalmente o google-maps-api,

```typescript
\frontend\src\pages\Home\components\ContactsList\index.js

 <GoogleMap
          center={center}
          zoom={16}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          onLoad={setMap}
        >
          {places.map((place, index) => (
            <>
              {place.geometry && place.geometry.location ? (
                <Marker
                  key={`${index}-marker`}
                  position={place.geometry.location}
                  onClick={() => setSelectedPlace(place)}
                  icon={{
                    url: pin,
                    scaledSize: new google.maps.Size(36, 36),
                  }}
                  draggable={true}
                  onDragEnd={(coord: any) => onMarkerDragEnd(coord, index)}
                >
                  {selectedPlace && selectedPlace === place && (
                    <InfoWindow
                      key={`info-window-${index}`}
                      onCloseClick={() => setSelectedPlace(null)}
                    >
                      <div>
                        <h1>Info Window</h1>
                        <p>{selectedPlace.formatted_address}</p>
                      </div>
                    </InfoWindow>
                  )}
                </Marker>
              ) : null}
            </>
          ))}
          {pois.map((poi, index) => (
            <Marker
              key={`marker-poi-${index}`}
              position={{
                lat: poi.lat,
                lng: poi.lng,
              }}
              onClick={() => setPoiSelected(poi)}
              icon={{
                url: pinPoi,
                scaledSize: new google.maps.Size(36, 36),
              }}
            />
          ))}
          {/* Rotas */}
          {!response && pointA && (
            <Marker
              position={pointA}
              icon={{
                url: pinRoute,
                scaledSize: new google.maps.Size(36, 36),
              }}
              draggable={true}
              onDragEnd={(coord: any) => onMarkerDragEnd(coord, 1)}
            />
          )}

          {!response && pointB && (
            <Marker
              position={pointB}
              icon={{
                url: pinRoute,
                scaledSize: new google.maps.Size(36, 36),
              }}
              onDragEnd={(coord: any) => onMarkerDragEnd(coord, 1)}
            />
          )}

          {origin && destination && (
            <DirectionsService
              options={directionsServiceOption}
              callback={directionsCallback}
            />
          )}

          {response && directionsRendererOptions && (
            <DirectionsRenderer options={directionsRendererOptions} />
          )}
        </GoogleMap>
```

</div>
