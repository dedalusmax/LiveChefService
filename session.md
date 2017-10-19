
# Plan predavanja

- termin: 11:15 - 12:00 (prije ručka)
- oboje predajemo i pokazujemo demo
- planirano vrijeme predavanja: 40 minuta + 5 min za pitanja

## Priprema

- uključiti laptope u struju i prijaviti se na LAN 
- isključiti nepotrebne aplikacije (Skype, mail, IM)
- otvoriti VS 2017 (kao admin) i projekt
- zatvoriti sve datoteke
- namjestiti veliki font za editor
- rebuild projekta i probati rad
- otvoriti prezentaciju i startati 
- povećalo: WIN + PLUS i kretanje s mišem
- otkriti IP adresu prvog laptopa
- otkriti kako se prespajaju dva laptopa za display (ako bude potrebe)

## UVOD (5:00)

- R: početni slajdovi do arhitekture

## DEMO (3:00)

- A: pokrenuti projekt
- objasniti što smo željeli postići i kako radi
- prikazati strukturu projekta i tehnologije (povećalo!)
- objasniti serversku stranu (modeli, repo, kontroleri)
- objasniti klijentsku stranu

## MEDIA STREAM (5:00)

- R: ispričati arhitekturu, sadržaj i media stream
- A: nastaviti na aplikaciji (novo kuhanje)
- pokazati postavke audia/video u aplikaciji
- u projektu: new-cooking.view-model.js (enumerateDevices i handler)
- pokrenuti kuhanje u apl, pokazati što smo zamislili pod kuhanjem
- u projektu: cooking-presenter.vm i communicator.vm
- bitno, između ostalog, pokazati getMediaStream 
- u aplikaciji prikazati filtriranje i snapshotiranje
- odustati od kuhanja

## SIGNALLING i PEER CONNECTION (9:30)

- R: ispričati o signallingu
- ispričati o rtc peer connection
- A: u projektu pokazati serverski dio SignalR (ChefHub)
- na klijentskom dijelu: root.vm, main.vm i objasniti root.hub
- A: na drugom laptopu spojiti se na aplikaciju, tipa: https://192.168.1.35/livechefservice
- R: na prvom laptopu odlogirati se i prijaviti kao "ratko"
- otići na users i uspostaviti video i audio call
- R: nastavlja pokazivati kod umjesto A
- communicator: startLocalStream, mediaRetrieved
- ChefHub: Join
- communicator: joinRequested, natrag na mediaRetrieved, startCommunication, rtcMessageReceived, createConnection
- vraćamo se na apl, i probati audio stream

## DATA CHANNEL I MEDIA RECORDER (7:30)

- A: prezentacija data channela
- pokazati kod koji je u komunikatoru
- u aplikaciji s drugog laptopa poslati datoteku
- A: prezentacija media recordera
- pokazati kod koji je u presenteru
- pokazati kod u vieweru da se vidi kako je to kod gledatelja
- A na drugom laptopu, R uzima kapu i kuha na prvom laptopu
- nakon gotovog kuhanja je kraj

## ZAKLJUČAK (1:00)

