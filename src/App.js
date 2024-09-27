import { useEffect, useState, Fragment, useMemo, useRef } from 'react';
import './debates.css';

const key = platform_id;

const defaultSettings = {
  enabled: true,
  round: 1,
  enambledRounds: [1, 2],
};

const type = {
  display: 'grid',
  gridTemplateRows: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '20px',
  margin: '0 0 55px 0',
};

function App() {
  const queryParams = new URLSearchParams(window.location.search);
  const municipalityQuery = queryParams.get('municipality');
  const myDivRef = useRef(null);

  const [debates, setDebates] = useState({});
  const [settings, setSettings] = useState(defaultSettings);
  const [tab, setTab] = useState(settings.round);
  const [query, setQuery] = useState('');

  const getDebates = async () => {
    const request = await fetch(
      `https://rinkimai2024-api-401796576931.europe-west1.run.app/${key}/debates`,
      { method: 'GET' }
    );
    const response = await request.json();
    if (response.settings) setSettings(response.settings);
    if (response.settings?.mainRound) setTab(response.settings.mainRound);
    setDebates(response?.data.reduce((a, v) => ({ ...a, [v.round]: v }), {}));
    if (municipalityQuery) {
      setQuery(municipalityQuery);
      myDivRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const YoutubeEmbed = ({ embedId }) => (
    <iframe
      width={560}
      height={315}
      src={`https://www.youtube.com/embed/${embedId}`}
      frameBorder='0'
      allowFullScreen
      title='YouTube video player'
      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
      srcDoc={`<style>*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black}</style><a href=https://www.youtube.com/embed/${embedId}/?autoplay=1><img src=https://img.youtube.com/vi/${embedId}/hqdefault.jpg><span>▶</span></a>`}
    />
  );

  const pickTab = (id) => {
    if (settings.enambledRounds.includes(id)) setTab(id);
  };

  const searchDebates = (search, x) => {
    return search === ''
      ? x
      : x.filter((debate) => {
          return debate.municipality
            .toLowerCase()
            .replace(/\p{M}/gu, '')
            .includes(search.toLowerCase());
        });
  };

  const roundOne = useMemo(
    () =>
      debates['1'] && searchDebates(query, debates['1'] && debates['1'].data),
    [query, debates]
  );
  const roundTwo = useMemo(
    () =>
      debates['2'] && searchDebates(query, debates['2'] && debates['2'].data),
    [query, debates]
  );

  useEffect(() => {
    getDebates();
  }, []);

  useEffect(() => {
    if (query) myDivRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [roundOne, roundTwo]);

  return (
    <div ref={myDivRef} className='tabs-wrap clearfix'>
      {(!settings.enabled && '') ||
        (debates.length < 1 && (
          <div
            style={{ paddingTop: 35, paddingBottom: 15 }}
            className='site-loader'
          >
            <img src='img/icon-load.svg' alt='' className='site-loader__icon' />
          </div>
        )) || (
          <>
            <ul className='tabs-nav'>
              <li className='tabs-nav__items' onClick={() => pickTab(1)}>
                <span
                  style={{ cursor: 'pointer' }}
                  className={`tabs-nav__links ${tab === 1 && 'active'}`}
                >
                  I turas
                </span>
              </li>
              <li className='tabs-nav__items' onClick={() => pickTab(2)}>
                <span
                  style={{ cursor: 'pointer' }}
                  className={`tabs-nav__links ${tab === 2 && 'active'}`}
                >
                  II turas
                </span>
              </li>
            </ul>
            {tab === 1 &&
              debates['1'] &&
              settings.enambledRounds.includes(1) && (
                <div
                  className='tabs-panels open clearfix js-tabs-panels'
                >
                  <div className='tabs-search'>
                    <label
                      htmlFor='tabs-search-55569'
                      className='visually-hidden'
                    >
                      Įveskite apygardos pavadinimą
                    </label>
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      type='text'
                      name='text'
                      placeholder='Įveskite apygardos pavadinimą'
                      className='tabs-search__input'
                      id='tabs-search-55569'
                    />
                    <button className='tabs-search__btn' aria-label='ieškoti'>
                      <img src='img/icon-search.svg' alt='' />
                    </button>
                  </div>
                  {roundOne.map((municipality) => {
                    const seimo = municipality.data.filter(
                      (type) => type.type === 'seimo'
                    );
                    return (
                      <Fragment key={municipality.municipality + '_' + '1'}>
                        <h2>{municipality.municipality}</h2>
                        <div className='debate_type'>
                          {(seimo.length && (
                            <div>
                              <ul style={type} className='debate-list'>
                                {seimo.map((data) => {
                                  return (
                                    <li
                                      key={data.id}
                                      className='debate-list__items'
                                    >
                                      <YoutubeEmbed
                                        embedId={data.youtube_url}
                                      />
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          )) ||
                            ''}
                        </div>
                      </Fragment>
                    );
                  })}
                </div>
              )}
            {tab === 2 &&
              debates['2'] &&
              settings.enambledRounds.includes(2) && (
                <div className='tabs-panels open clearfix js-tabs-panels'>
                  <div className='tabs-search'>
                    <label
                      htmlFor='tabs-search-55569'
                      className='visually-hidden'
                    >
                      Įveskite apygardos pavadinimą
                    </label>
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      type='text'
                      name='text'
                      placeholder='Įveskite apygardos pavadinimą'
                      className='tabs-search__input'
                      id='tabs-search-55569'
                    />
                    <button className='tabs-search__btn' aria-label='ieškoti'>
                      <img src='img/icon-search.svg' alt='' />
                    </button>
                  </div>
                  {roundTwo.map((municipality) => {
                    const seimo = municipality.data.filter(
                      (type) => type.type === 'seimo'
                    );
                    return (
                      <Fragment key={municipality.municipality + '_' + '1'}>
                        <h2>{municipality.municipality}</h2>
                        <div className='debate_type'>
                          {(seimo.length && (
                            <div>
                              <ul style={type} className='debate-list'>
                                {seimo.map((data) => {
                                  return (
                                    <li
                                      key={data.id}
                                      className='debate-list__items'
                                    >
                                      <YoutubeEmbed
                                        embedId={data.youtube_url}
                                      />
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          )) ||
                            ''}
                          {/* {tarybos.length && (
                              <div>
                                <h4 className="text-uppercase">Tarybos rinkimų debatai</h4>
                                <ul style={type} className="debate-list">
                                  {
                                    tarybos.map((data) => {
                                      return (
                                        <li key={data.id} className="debate-list__items">
                                          <YoutubeEmbed embedId={data.youtube_id} />
                                        </li>
                                      );
                                    })
                                  }
                                </ul>
                              </div>
                            ) || ''} */}
                        </div>
                      </Fragment>
                    );
                  })}
                </div>
              )}
          </>
        )}
    </div>
  );
}

export default App;
