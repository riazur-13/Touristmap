# Map expansion: 28 → 84 attractions

2026-10-01, branch `feat/more-attractions`. This implements the places approved from [`new-attractions-candidates.md`](new-attractions-candidates.md): all 56 marked ✅.

## Summary

- **56 places added,** for 84 in total. They cover 10 of the 11 districts of Chattogram Division; the research found nothing documented for Lakshmipur.
- **Every photo is now a Wikimedia Commons file** under CC0, CC BY, CC BY-SA or public domain, credited in the app.
  - 83 attractions have a photo; 1 uses the placeholder.
  - Of the original 28 photos, 5 were already Commons files and are kept, 22 unknown-origin photos are replaced, and 1 has no free alternative.
  - Licenses: CC BY-SA 4.0 × 63, CC BY-SA 3.0 × 11, Public domain × 3, CC BY-SA 2.0 × 2, CC BY 3.0 × 2, CC0 × 1, CC BY 2.0 × 1.
- **Entry fee, opening hours and facilities are now optional,** and the details panel hides a row with no value. None of the new places have them, since no reliable source gives them. Meghla's placeholder fee and hours are removed.
- **Markers cluster,** and the map opens fitted to all attractions.
- **Checks:** lint and build clean; 679 tests pass; browser-checked (see Verification).

## Places added

Descriptions state only facts from each place's English or Bengali Wikipedia intro, or from its checked photo. Coordinates come from the OSM or Wikidata point chosen during research.

### Chattogram (25)

| # | Name | Category | Coordinates | Source | Learn More |
|---|---|---|---|---|---|
| 30 | Batali Hill | Hill Station | 22.34398, 91.81614 | Wikidata [Q4868562](https://www.wikidata.org/wiki/Q4868562) | [English Wikipedia](https://en.wikipedia.org/wiki/Batali_Hill) |
| 31 | Bayazid Bostami Shrine | Religious Site | 22.38904, 91.80919 | [OSM way 156280150](https://www.openstreetmap.org/way/156280150) | [English Wikipedia](https://en.wikipedia.org/wiki/Shrine_of_Bayazid_Bostami) |
| 32 | Anderkilla Shahi Jame Mosque | Religious Site | 22.34101, 91.83671 | Wikidata [Q13056990](https://www.wikidata.org/wiki/Q13056990) | [English Wikipedia](https://en.wikipedia.org/wiki/Anderkilla_Shahi_Jame_Mosque) |
| 33 | Chandanpura Mosque | Religious Site | 22.34978, 91.8382 | [OSM node 2813103719](https://www.openstreetmap.org/node/2813103719) | [English Wikipedia](https://en.wikipedia.org/wiki/Chandanpura_Mosque) |
| 34 | Chatteshwari Temple | Religious Site | 22.35274, 91.82605 | [OSM way 514664574](https://www.openstreetmap.org/way/514664574) | [English Wikipedia](https://en.wikipedia.org/wiki/Chatteshwari_Temple) |
| 35 | Holy Rosary Cathedral | Religious Site | 22.33241, 91.8394 | Wikidata [Q23832227](https://www.wikidata.org/wiki/Q23832227) | [English Wikipedia](https://en.wikipedia.org/wiki/Our_Lady_of_the_Holy_Rosary_Cathedral,_Chittagong) |
| 36 | Zia Memorial Museum | Historical Site | 22.34825, 91.82384 | [OSM way 244157243](https://www.openstreetmap.org/way/244157243) | [English Wikipedia](https://en.wikipedia.org/wiki/Zia_Memorial_Museum) |
| 37 | Chattogram Court Building | Historical Site | 22.33483, 91.83461 | Wikidata [Q18987428](https://www.wikidata.org/wiki/Q18987428) | [English Wikipedia](https://en.wikipedia.org/wiki/Chittagong_Court_Building) |
| 38 | Darul Adalat (Portuguese Building) | Historical Site | 22.35197, 91.83195 | Wikidata [Q66973681](https://www.wikidata.org/wiki/Q66973681) | [English Wikipedia](https://en.wikipedia.org/wiki/Darul_Adalat) |
| 39 | Bangladesh Railway Museum | Cultural Center | 22.35433, 91.80132 | Wikidata [Q63347873](https://www.wikidata.org/wiki/Q63347873) | [English Wikipedia](https://en.wikipedia.org/wiki/Bangladesh_Railway_Museum) |
| 40 | Chittagong Zoo | Natural Wonder | 22.36672, 91.79592 | [OSM way 843540015](https://www.openstreetmap.org/way/843540015) | [English Wikipedia](https://en.wikipedia.org/wiki/Chittagong_Zoo) |
| 41 | Kattali Sea Beach | Beach | 22.35215, 91.75765 | [OSM node 11215124364](https://www.openstreetmap.org/node/11215124364) | [English Wikipedia](https://en.wikipedia.org/wiki/Kattali_Beach) |
| 42 | Banshbaria Sea Beach | Beach | 22.54447, 91.66826 | [OSM node 11064436038](https://www.openstreetmap.org/node/11064436038) | [English Wikipedia](https://en.wikipedia.org/wiki/Banshbaria_Beach) |
| 43 | Sitakunda Botanical Garden and Eco Park | Natural Wonder | 22.61275, 91.68408 | [OSM way 1012210569](https://www.openstreetmap.org/way/1012210569) | [English Wikipedia](https://en.wikipedia.org/wiki/Botanical_Garden_and_Eco-Park,_Sitakunda) |
| 44 | Baroiyadhala National Park | Natural Wonder | 22.65438, 91.66826 | Wikidata [Q16345984](https://www.wikidata.org/wiki/Q16345984) | [English Wikipedia](https://en.wikipedia.org/wiki/Baroiyadhala_National_Park) |
| 45 | Khoiyachora Waterfall | Natural Wonder | 22.76944, 91.61194 | Wikidata [Q18987373](https://www.wikidata.org/wiki/Q18987373) | [English Wikipedia](https://en.wikipedia.org/wiki/Khoiyachora_Waterfall) |
| 46 | Mohamaya Lake | Natural Wonder | 22.8168, 91.5719 | Wikidata [Q20613002](https://www.wikidata.org/wiki/Q20613002) | [English Wikipedia](https://en.wikipedia.org/wiki/Mahamaya_Chhara_Irrigation_Extension_Project) |
| 47 | Napittachora Waterfalls | Natural Wonder | 22.747, 91.6196 | Wikidata [Q50846309](https://www.wikidata.org/wiki/Q50846309) | [Bengali Wikipedia](https://bn.wikipedia.org/wiki/%E0%A6%A8%E0%A6%BE%E0%A6%AA%E0%A6%BF%E0%A6%A4%E0%A7%8D%E0%A6%A4%E0%A6%BE%E0%A6%9B%E0%A6%A1%E0%A6%BC%E0%A6%BE_%E0%A6%9F%E0%A7%8D%E0%A6%B0%E0%A7%87%E0%A6%87%E0%A6%B2) |
| 48 | Komoldoho Waterfall | Natural Wonder | 22.69076, 91.63996 | Wikidata [Q122355527](https://www.wikidata.org/wiki/Q122355527) | none (no article) |
| 49 | Hazarikhil Wildlife Sanctuary | Natural Wonder | 22.74223, 91.6469 | Wikidata [Q18989280](https://www.wikidata.org/wiki/Q18989280) | [English Wikipedia](https://en.wikipedia.org/wiki/Hajarikhil_Wildlife_Sanctuary) |
| 50 | Bhatiari Lake | Natural Wonder | 22.43234, 91.75991 | [OSM way 424272802](https://www.openstreetmap.org/way/424272802) | none (no article) |
| 51 | Sandwip Island | Natural Wonder | 22.49051, 91.42118 | Wikidata [Q724079](https://www.wikidata.org/wiki/Q724079) | [English Wikipedia](https://en.wikipedia.org/wiki/Sandwip) |
| 52 | Banshkhali Sea Beach | Beach | 22.06069, 91.8738 | Wikidata [Q114667594](https://www.wikidata.org/wiki/Q114667594) | [English Wikipedia](https://en.wikipedia.org/wiki/Banshkhali_Beach) |
| 53 | Banshkhali Eco-Park | Natural Wonder | 21.98971, 91.98183 | Wikidata [Q18988177](https://www.wikidata.org/wiki/Q18988177) | [Bengali Wikipedia](https://bn.wikipedia.org/wiki/%E0%A6%AC%E0%A6%BE%E0%A6%81%E0%A6%B6%E0%A6%96%E0%A6%BE%E0%A6%B2%E0%A7%80_%E0%A6%87%E0%A6%95%E0%A7%8B%E0%A6%AA%E0%A6%BE%E0%A6%B0%E0%A7%8D%E0%A6%95) |
| 54 | Chunati Wildlife Sanctuary | Natural Wonder | 21.93286, 92.03375 | [OSM way 1012210647](https://www.openstreetmap.org/way/1012210647) | [English Wikipedia](https://en.wikipedia.org/wiki/Chunati_Wildlife_Sanctuary) |

### Cox's Bazar (5)

| # | Name | Category | Coordinates | Source | Learn More |
|---|---|---|---|---|---|
| 55 | Rangkut Banasram, Ramu | Religious Site | 21.40217, 92.11043 | Wikidata [Q60715689](https://www.wikidata.org/wiki/Q60715689) | [English Wikipedia](https://en.wikipedia.org/wiki/Ramkot_Banashram) |
| 56 | Sonadia Island | Natural Wonder | 21.48333, 91.9 | Wikidata [Q3348160](https://www.wikidata.org/wiki/Q3348160) | [English Wikipedia](https://en.wikipedia.org/wiki/Sonadia_Island) |
| 57 | Kutubdia Lighthouse | Historical Site | 21.86473, 91.84253 | [OSM way 1551490248](https://www.openstreetmap.org/way/1551490248) | [English Wikipedia](https://en.wikipedia.org/wiki/Kutubdia_Dwip) |
| 58 | Shah Porir Dwip | Beach | 20.7674, 92.334 | Wikidata [Q7489302](https://www.wikidata.org/wiki/Q7489302) | [English Wikipedia](https://en.wikipedia.org/wiki/Shah_Porir_Dwip) |
| 59 | Teknaf Wildlife Sanctuary | Natural Wonder | 20.99166, 92.22084 | [OSM way 1012210598](https://www.openstreetmap.org/way/1012210598) | [English Wikipedia](https://en.wikipedia.org/wiki/Teknaf_Wildlife_Sanctuary) |

### Bandarban (6)

| # | Name | Category | Coordinates | Source | Learn More |
|---|---|---|---|---|---|
| 60 | Keokradong | Hill Station | 21.94988, 92.51452 | [OSM node 477229387](https://www.openstreetmap.org/node/477229387) | [English Wikipedia](https://en.wikipedia.org/wiki/Keokradong) |
| 61 | Nilachal | Hill Station | 22.16863, 92.20988 | [OSM node 10089049705](https://www.openstreetmap.org/node/10089049705) | [Bengali Wikipedia](https://bn.wikipedia.org/wiki/%E0%A6%A8%E0%A7%80%E0%A6%B2%E0%A6%BE%E0%A6%9A%E0%A6%B2) |
| 62 | Amiakhum Waterfall | Natural Wonder | 21.77666, 92.54868 | [OSM node 6555490233](https://www.openstreetmap.org/node/6555490233) | [English Wikipedia](https://en.wikipedia.org/wiki/Amiakhum_Waterfall) |
| 63 | Rijuk Waterfall | Natural Wonder | 22.0154, 92.4018 | Wikidata [Q18987309](https://www.wikidata.org/wiki/Q18987309) | [English Wikipedia](https://en.wikipedia.org/wiki/Rijuk_Waterfall) |
| 64 | Ram Jadi | Religious Site | 22.19552, 92.24441 | Wikidata [Q70317033](https://www.wikidata.org/wiki/Q70317033) | none (no article) |
| 65 | Prantik Lake | Natural Wonder | 22.10684, 92.17122 | [OSM way 477438554](https://www.openstreetmap.org/way/477438554) | [Bengali Wikipedia](https://bn.wikipedia.org/wiki/%E0%A6%AA%E0%A7%8D%E0%A6%B0%E0%A6%BE%E0%A6%A8%E0%A7%8D%E0%A6%A4%E0%A6%BF%E0%A6%95_%E0%A6%B2%E0%A7%87%E0%A6%95) |

### Rangamati (4)

| # | Name | Category | Coordinates | Source | Learn More |
|---|---|---|---|---|---|
| 66 | Sajek Valley | Hill Station | 23.39092, 92.28551 | [OSM node 9873260928](https://www.openstreetmap.org/node/9873260928) | [English Wikipedia](https://en.wikipedia.org/wiki/Sajek_Valley) |
| 67 | Rajban Vihara | Religious Site | 22.66576, 92.17061 | [OSM node 1841677930](https://www.openstreetmap.org/node/1841677930) | [Bengali Wikipedia](https://bn.wikipedia.org/wiki/%E0%A6%B0%E0%A6%BE%E0%A6%9C%E0%A6%AC%E0%A6%A8_%E0%A6%AC%E0%A6%BF%E0%A6%B9%E0%A6%BE%E0%A6%B0) |
| 68 | Kaptai National Park | Natural Wonder | 22.49995, 92.17739 | [OSM node 5162388582](https://www.openstreetmap.org/node/5162388582) | [English Wikipedia](https://en.wikipedia.org/wiki/Kaptai_National_Park) |
| 69 | Polwel Park | Natural Wonder | 22.64116, 92.19992 | Wikidata [Q122360329](https://www.wikidata.org/wiki/Q122360329) | none (no article) |

### Khagrachari (3)

| # | Name | Category | Coordinates | Source | Learn More |
|---|---|---|---|---|---|
| 70 | Alutila Cave | Natural Wonder | 23.08833, 91.95667 | Wikidata [Q19881899](https://www.wikidata.org/wiki/Q19881899) | [English Wikipedia](https://en.wikipedia.org/wiki/Alutila_Cave) |
| 71 | Khagrachari Hill District Council Park | Natural Wonder | 23.09788, 91.97262 | [OSM way 531423559](https://www.openstreetmap.org/way/531423559) | none (no article) |
| 72 | Shantipur Aranya Kutir | Religious Site | 23.25951, 91.89107 | Wikidata [Q61747782](https://www.wikidata.org/wiki/Q61747782) | [Bengali Wikipedia](https://bn.wikipedia.org/wiki/%E0%A6%AA%E0%A6%BE%E0%A6%A8%E0%A6%9B%E0%A6%A1%E0%A6%BC%E0%A6%BF_%E0%A6%B6%E0%A6%BE%E0%A6%A8%E0%A7%8D%E0%A6%A4%E0%A6%BF%E0%A6%AA%E0%A7%81%E0%A6%B0_%E0%A6%85%E0%A6%B0%E0%A6%A3%E0%A7%8D%E0%A6%AF_%E0%A6%95%E0%A7%81%E0%A6%9F%E0%A6%BF%E0%A6%B0) |

### Cumilla (7)

| # | Name | Category | Coordinates | Source | Learn More |
|---|---|---|---|---|---|
| 73 | Shalban Vihara | Historical Site | 23.42518, 91.1375 | [OSM way 24694184](https://www.openstreetmap.org/way/24694184) | [English Wikipedia](https://en.wikipedia.org/wiki/Shalban_Vihara) |
| 74 | Mainamati War Cemetery | Historical Site | 23.48699, 91.11201 | [OSM node 4809123023](https://www.openstreetmap.org/node/4809123023) | [English Wikipedia](https://en.wikipedia.org/wiki/Mainamati_War_Cemetery) |
| 75 | Mainamati Museum | Cultural Center | 23.42359, 91.1372 | [OSM node 3955339124](https://www.openstreetmap.org/node/3955339124) | [English Wikipedia](https://en.wikipedia.org/wiki/Mainamati) |
| 76 | Kotila Mura | Historical Site | 23.46092, 91.12351 | [OSM node 7472549186](https://www.openstreetmap.org/node/7472549186) | [English Wikipedia](https://en.wikipedia.org/wiki/Kutila_Mura) |
| 77 | Dharmasagar | Natural Wonder | 23.46444, 91.17944 | Wikidata [Q15213881](https://www.wikidata.org/wiki/Q15213881) | [English Wikipedia](https://en.wikipedia.org/wiki/Dharmasagar_(pond)) |
| 78 | Jagannath Temple (Sateroratna Mandir) | Religious Site | 23.46222, 91.20873 | Wikidata [Q2093153](https://www.wikidata.org/wiki/Q2093153) | [English Wikipedia](https://en.wikipedia.org/wiki/Comilla_Jagannath_Temple) |
| 79 | Shah Shuja Mosque | Religious Site | 23.46694, 91.18512 | Wikidata [Q70322446](https://www.wikidata.org/wiki/Q70322446) | [English Wikipedia](https://en.wikipedia.org/wiki/Shah_Shuja_Mosque) |

### Brahmanbaria (2)

| # | Name | Category | Coordinates | Source | Learn More |
|---|---|---|---|---|---|
| 80 | Kal Bhairab Temple | Religious Site | 23.98593, 91.11292 | [OSM node 4752755886](https://www.openstreetmap.org/node/4752755886) | [English Wikipedia](https://en.wikipedia.org/wiki/Kal_Bhairab_Temple,_Brahmanbaria) |
| 81 | Arifil Mosque | Religious Site | 24.07002, 91.10464 | Wikidata [Q31724713](https://www.wikidata.org/wiki/Q31724713) | [English Wikipedia](https://en.wikipedia.org/wiki/Arifil_Mosque) |

### Chandpur (2)

| # | Name | Category | Coordinates | Source | Learn More |
|---|---|---|---|---|---|
| 82 | Molhead, Chandpur | Natural Wonder | 23.23107, 90.63937 | [OSM node 8888461222](https://www.openstreetmap.org/node/8888461222) | none (no article) |
| 83 | Hajiganj Bara Mosque | Religious Site | 23.25161, 90.85387 | [OSM relation 13842734](https://www.openstreetmap.org/relation/13842734) | [Bengali Wikipedia](https://bn.wikipedia.org/wiki/%E0%A6%B9%E0%A6%BE%E0%A6%9C%E0%A7%80%E0%A6%97%E0%A6%9E%E0%A7%8D%E0%A6%9C_%E0%A6%AC%E0%A6%A1%E0%A6%BC_%E0%A6%AE%E0%A6%B8%E0%A6%9C%E0%A6%BF%E0%A6%A6) |

### Noakhali (2)

| # | Name | Category | Coordinates | Source | Learn More |
|---|---|---|---|---|---|
| 84 | Nijhum Dwip | Natural Wonder | 22.06356, 91.01075 | Wikidata [Q3350292](https://www.wikidata.org/wiki/Q3350292) | [English Wikipedia](https://en.wikipedia.org/wiki/Nijhum_Dwip) |
| 85 | Bazra Shahi Mosque | Religious Site | 23.00663, 91.09123 | Wikidata [Q18110330](https://www.wikidata.org/wiki/Q18110330) | [English Wikipedia](https://en.wikipedia.org/wiki/Bajra_Shahi_Mosque) |

## Photo sources

Every file was downloaded from Wikimedia Commons, and its license was re-read from Commons metadata at download time. The download script refuses anything that isn't CC0, CC BY, CC BY-SA or public domain. Conversion is the project pipeline: at most 1200 px wide, WebP quality 80. Every file came out at quality 80; the step down to 75 or 70 wasn't needed.

Images total **17.6 MB** for 83 files. That's more per photo than the 1.67 MB for 28 photos in the first pass, because most of those originals were small, low-resolution JPEGs.

| # | Attraction | Commons file | Author | License | Output |
|---|---|---|---|---|---|
| 1 | Cox's Bazar Beach *(replaced)* | [Cox's Bazaar Sea Beach.jpg](https://commons.wikimedia.org/wiki/File:Cox's_Bazaar_Sea_Beach.jpg) | Raquib | CC BY-SA 4.0 | 1200x790, 88 KB |
| 3 | Rangamati (Kaptai Lake) *(replaced)* | [Aronnak Holiday Cottage, Rangamati10.jpg](https://commons.wikimedia.org/wiki/File:Aronnak_Holiday_Cottage,_Rangamati10.jpg) | Fahad Faisal | CC BY-SA 4.0 | 1200x900, 114 KB |
| 4 | Patenga Beach *(replaced)* | [Side view of Patenga sea beach (10).jpg](https://commons.wikimedia.org/wiki/File:Side_view_of_Patenga_sea_beach_(10).jpg) | Moheen Reeyad | CC BY-SA 4.0 | 1200x798, 48 KB |
| 5 | Foy's Lake *(replaced)* | [Foy's Lake 2 by Rahat.jpg](https://commons.wikimedia.org/wiki/File:Foy's_Lake_2_by_Rahat.jpg) | Ctg4Rahat | CC0 | 1200x900, 165 KB |
| 6 | Boga Lake *(replaced)* | [বগা লেক.jpg](https://commons.wikimedia.org/wiki/File:%E0%A6%AC%E0%A6%97%E0%A6%BE_%E0%A6%B2%E0%A7%87%E0%A6%95.jpg) | Rocky Masum | CC BY-SA 4.0 | 1200x900, 305 KB |
| 7 | Chandranath Temple *(replaced)* | [Chandranath Temple 2019-01-16 (27).jpg](https://commons.wikimedia.org/wiki/File:Chandranath_Temple_2019-01-16_(27).jpg) | Shahidul Hasan Roman | CC BY-SA 4.0 | 1200x569, 192 KB |
| 8 | Nilgiri Hills *(replaced)* | [Nilgiri Hill Resort, Nilgiri, Bandarban (9813).jpg](https://commons.wikimedia.org/wiki/File:Nilgiri_Hill_Resort,_Nilgiri,_Bandarban_(9813).jpg) | Moheen Reeyad | CC BY-SA 4.0 | 1200x800, 194 KB |
| 9 | Inani Beach *(replaced)* | [Inani Beach (Cox's Bazar).jpg](https://commons.wikimedia.org/wiki/File:Inani_Beach_(Cox's_Bazar).jpg) | Syed Sajidul Islam | CC BY-SA 4.0 | 1200x800, 91 KB |
| 10 | Ethnological Museum *(kept: was already this file)* | [Entrance of Ethnological Museum (03).jpg](https://commons.wikimedia.org/wiki/File:Entrance_of_Ethnological_Museum_(03).jpg) | Moheen Reeyad | CC BY-SA 4.0 | 1200x798, 172 KB |
| 11 | Himchari National Park *(kept: was already this file)* | [Himchari National Park (2).jpg](https://commons.wikimedia.org/wiki/File:Himchari_National_Park_(2).jpg) | Rocky Masum | CC BY-SA 4.0 | 1200x675, 327 KB |
| 12 | Sangu River *(kept: was already this file)* | [Sangu River from Bandarban Town, 18 Nov, 2004.JPG](https://commons.wikimedia.org/wiki/File:Sangu_River_from_Bandarban_Town,_18_Nov,_2004.JPG) | Mohammed Tawsif Salam | CC BY-SA 3.0 | 1200x900, 147 KB |
| 13 | Teknaf Beach *(replaced)* | [Lengurbill beach 03.jpg](https://commons.wikimedia.org/wiki/File:Lengurbill_beach_03.jpg) | Rocky Masum | CC BY-SA 4.0 | 1200x675, 118 KB |
| 14 | Dulahazara Safari Park *(replaced)* | [Beautiful view of Dulahazra Safari Park.jpg](https://commons.wikimedia.org/wiki/File:Beautiful_view_of_Dulahazra_Safari_Park.jpg) | Syed sajidul islam | CC BY-SA 4.0 | 1200x800, 210 KB |
| 15 | Moheshkhali Island *(replaced)* | [Roads of Moheshkhali island, Cox's Bazar.jpg](https://commons.wikimedia.org/wiki/File:Roads_of_Moheshkhali_island,_Cox's_Bazar.jpg) | Syed Sajidul Islam | CC BY-SA 4.0 | 1200x798, 147 KB |
| 16 | Chittagong War Cemetery *(replaced)* | [Chittagong War Cemetery, Chattogram, Bangladesh (2).jpg](https://commons.wikimedia.org/wiki/File:Chittagong_War_Cemetery,_Chattogram,_Bangladesh_(2).jpg) | Md. T Mahtab | CC BY-SA 4.0 | 1200x690, 223 KB |
| 17 | Karnaphuli River *(replaced)* | [Karnafully River to Bay of Bengal (16471666352).jpg](https://commons.wikimedia.org/wiki/File:Karnafully_River_to_Bay_of_Bengal_(16471666352).jpg) | Silver Blue from India | CC BY-SA 2.0 | 1200x800, 179 KB |
| 18 | Meghla Parjatan Complex *(replaced)* | [Meghla Park Lake, Bandarban (9677).jpg](https://commons.wikimedia.org/wiki/File:Meghla_Park_Lake,_Bandarban_(9677).jpg) | Moheen Reeyad | CC BY-SA 4.0 | 1200x800, 206 KB |
| 19 | Alikadam *(replaced)* | [Alikadam 01.JPG](https://commons.wikimedia.org/wiki/File:Alikadam_01.JPG) | Tanweer Morshed | CC BY-SA 3.0 | 1200x900, 290 KB |
| 20 | Parki Beach *(replaced)* | [Parki Sea Beach (Partial View 1).JPG](https://commons.wikimedia.org/wiki/File:Parki_Sea_Beach_(Partial_View_1).JPG) | Rumman Alam Chowdhury | CC BY-SA 3.0 | 1200x900, 62 KB |
| 21 | Jadipai Waterfall *(replaced)* | [Jadipai Water Fall, Keokradong, Bandarban, Bangladesh.jpg](https://commons.wikimedia.org/wiki/File:Jadipai_Water_Fall,_Keokradong,_Bandarban,_Bangladesh.jpg) | DM Rehem | CC BY-SA 4.0 | 1200x1805, 408 KB |
| 22 | Buddha Dhatu Jadi *(kept: was already this file)* | [Buddha Dhatu Jadi 05.jpg](https://commons.wikimedia.org/wiki/File:Buddha_Dhatu_Jadi_05.jpg) | Azimronnie | CC BY-SA 4.0 | 1200x799, 214 KB |
| 23 | Nafakhum Waterfall *(replaced)* | [Nafakhum Waterfalls.jpg](https://commons.wikimedia.org/wiki/File:Nafakhum_Waterfalls.jpg) | লাজ মাহমুদ | CC BY-SA 4.0 | 1200x795, 183 KB |
| 24 | Saint Martin's Island *(replaced)* | [Saint Martin's Island.JPG](https://commons.wikimedia.org/wiki/File:Saint_Martin's_Island.JPG) | Niaz morshed Shovon | Public domain | 1200x900, 268 KB |
| 25 | Tajingdong (Bijoy) *(replaced)* | [তাজিংডং এর চূড়া.jpg](https://commons.wikimedia.org/wiki/File:%E0%A6%A4%E0%A6%BE%E0%A6%9C%E0%A6%BF%E0%A6%82%E0%A6%A1%E0%A6%82_%E0%A6%8F%E0%A6%B0_%E0%A6%9A%E0%A7%82%E0%A6%A1%E0%A6%BC%E0%A6%BE.jpg) | Morshed Rahman Zubaer | CC BY-SA 4.0 | 1200x675, 172 KB |
| 26 | Khyang Para | — (placeholder) | | | |
| 27 | Chimbuk Hill *(replaced)* | [View from Chimbuk hill, Bandarban (2Q7A0721).jpg](https://commons.wikimedia.org/wiki/File:View_from_Chimbuk_hill,_Bandarban_(2Q7A0721).jpg) | Moheen Reeyad | CC BY-SA 4.0 | 1200x800, 230 KB |
| 28 | Hanging Bridge (Jhulonto Bridge) *(kept: was already this file)* | [Hanging bridge of Rangamati, Bangladesh. .jpg](https://commons.wikimedia.org/wiki/File:Hanging_bridge_of_Rangamati,_Bangladesh._.jpg) | Salim_Khandoker | CC BY-SA 4.0 | 1200x901, 219 KB |
| 29 | Shoilo Propat (Shoilo Waterfall) *(replaced)* | [Shoilo Propat Bandarban.jpg](https://commons.wikimedia.org/wiki/File:Shoilo_Propat_Bandarban.jpg) | Sabilaenun | CC BY-SA 3.0 | 1200x900, 222 KB |
| 30 | Batali Hill | [Batali Hill 02.jpg](https://commons.wikimedia.org/wiki/File:Batali_Hill_02.jpg) | Mehediabedin | CC BY-SA 4.0 | 1200x900, 202 KB |
| 31 | Bayazid Bostami Shrine | [BYEZEED BOSTAMI Mazar.(Photo by Rabiul Islam) - panoramio.jpg](https://commons.wikimedia.org/wiki/File:BYEZEED_BOSTAMI_Mazar.(Photo_by_Rabiul_Islam)_-_panoramio.jpg) | Md. Rabiul Islam | CC BY 3.0 | 1200x900, 185 KB |
| 32 | Anderkilla Shahi Jame Mosque | [Andarkilla Mosque front view.jpg](https://commons.wikimedia.org/wiki/File:Andarkilla_Mosque_front_view.jpg) | Intakhab | CC BY-SA 4.0 | 1200x674, 103 KB |
| 33 | Chandanpura Mosque | [Masjid-e-Siraj ud-Daulah right Side.jpg](https://commons.wikimedia.org/wiki/File:Masjid-e-Siraj_ud-Daulah_right_Side.jpg) | Risadul Islam (Foisal) | CC BY-SA 4.0 | 1200x800, 198 KB |
| 34 | Chatteshwari Temple | [Chatteshwari Temple Close View.jpg](https://commons.wikimedia.org/wiki/File:Chatteshwari_Temple_Close_View.jpg) | Risadul Islam (Foisal) | CC BY-SA 4.0 | 1200x800, 207 KB |
| 35 | Holy Rosary Cathedral | [Patharghatta Catholic Church Chittagong.JPG](https://commons.wikimedia.org/wiki/File:Patharghatta_Catholic_Church_Chittagong.JPG) | Bazaan | CC BY-SA 3.0 | 800x1000, 84 KB |
| 36 | Zia Memorial Museum | [Zia Museum 001.JPG](https://commons.wikimedia.org/wiki/File:Zia_Museum_001.JPG) | Azim Al Jabber | CC BY-SA 3.0 | 961x643, 74 KB |
| 37 | Chattogram Court Building | [Chittagong Court Building.JPG](https://commons.wikimedia.org/wiki/File:Chittagong_Court_Building.JPG) | Intakhab ctg | CC BY-SA 4.0 | 1200x800, 89 KB |
| 38 | Darul Adalat (Portuguese Building) | [Portuguese building from north-west side.jpg](https://commons.wikimedia.org/wiki/File:Portuguese_building_from_north-west_side.jpg) | Intakhab | CC BY-SA 4.0 | 1200x800, 320 KB |
| 39 | Bangladesh Railway Museum | [Bangladesh Railway Museum, Chattogram (2Q7A0322).jpg](https://commons.wikimedia.org/wiki/File:Bangladesh_Railway_Museum,_Chattogram_(2Q7A0322).jpg) | Moheen Reeyad | CC BY-SA 4.0 | 1200x800, 255 KB |
| 40 | Chittagong Zoo | [August 2025 visit at Chittagong Zoo by Owais Al Qarni 03.jpg](https://commons.wikimedia.org/wiki/File:August_2025_visit_at_Chittagong_Zoo_by_Owais_Al_Qarni_03.jpg) | Owais Al Qarni | CC BY-SA 4.0 | 1200x1604, 322 KB |
| 41 | Kattali Sea Beach | [A girl watching the view of nature.jpg](https://commons.wikimedia.org/wiki/File:A_girl_watching_the_view_of_nature.jpg) | Rupeshbd | CC BY-SA 4.0 | 1200x675, 121 KB |
| 42 | Banshbaria Sea Beach | [July 2025 view of Bashbaria sea beach by Owais Al Qarni 01.jpg](https://commons.wikimedia.org/wiki/File:July_2025_view_of_Bashbaria_sea_beach_by_Owais_Al_Qarni_01.jpg) | Owais Al Qarni | CC BY-SA 4.0 | 1200x900, 205 KB |
| 43 | Sitakunda Botanical Garden and Eco Park | [Entrance, Botanical Garden and Eco-Park, Sitakunda (01).jpg](https://commons.wikimedia.org/wiki/File:Entrance,_Botanical_Garden_and_Eco-Park,_Sitakunda_(01).jpg) | Moheen Reeyad | CC BY-SA 4.0 | 1200x798, 310 KB |
| 44 | Baroiyadhala National Park | [বারৈয়াঢালা ঝর্ণা.jpg](https://commons.wikimedia.org/wiki/File:%E0%A6%AC%E0%A6%BE%E0%A6%B0%E0%A7%88%E0%A6%AF%E0%A6%BC%E0%A6%BE%E0%A6%A2%E0%A6%BE%E0%A6%B2%E0%A6%BE_%E0%A6%9D%E0%A6%B0%E0%A7%8D%E0%A6%A3%E0%A6%BE.jpg) | কিংশুক পার্থ | CC BY-SA 4.0 | 1200x733, 246 KB |
| 45 | Khoiyachora Waterfall | [খৈয়াছড়া ঝর্ণা.jpg](https://commons.wikimedia.org/wiki/File:%E0%A6%96%E0%A7%88%E0%A6%AF%E0%A6%BC%E0%A6%BE%E0%A6%9B%E0%A6%A1%E0%A6%BC%E0%A6%BE_%E0%A6%9D%E0%A6%B0%E0%A7%8D%E0%A6%A3%E0%A6%BE.jpg) | RadioactivePratik | CC BY-SA 4.0 | 1200x1800, 726 KB |
| 46 | Mohamaya Lake | [Mahamaya Irrigation Dam Regulator (10).jpg](https://commons.wikimedia.org/wiki/File:Mahamaya_Irrigation_Dam_Regulator_(10).jpg) | Moheen Reeyad | CC BY-SA 4.0 | 1200x798, 270 KB |
| 47 | Napittachora Waterfalls | [নাপিত্তাছড়া ঝর্ণা 08.jpg](https://commons.wikimedia.org/wiki/File:%E0%A6%A8%E0%A6%BE%E0%A6%AA%E0%A6%BF%E0%A6%A4%E0%A7%8D%E0%A6%A4%E0%A6%BE%E0%A6%9B%E0%A6%A1%E0%A6%BC%E0%A6%BE_%E0%A6%9D%E0%A6%B0%E0%A7%8D%E0%A6%A3%E0%A6%BE_08.jpg) | MD SHAH IMRAN | CC BY-SA 4.0 | 1200x900, 432 KB |
| 48 | Komoldoho Waterfall | [Boro Komoldoho Ruposhi Waterfall 01.jpg](https://commons.wikimedia.org/wiki/File:Boro_Komoldoho_Ruposhi_Waterfall_01.jpg) | Al Riaz Uddin | CC BY-SA 4.0 | 1200x2133, 524 KB |
| 49 | Hazarikhil Wildlife Sanctuary | [Hajarikhil Wildlife Sanctuary.jpg](https://commons.wikimedia.org/wiki/File:Hajarikhil_Wildlife_Sanctuary.jpg) | Mir sunan | CC BY-SA 4.0 | 1200x741, 270 KB |
| 50 | Bhatiari Lake | [Bhatiari Lake (02).jpg](https://commons.wikimedia.org/wiki/File:Bhatiari_Lake_(02).jpg) | Moheen Reeyad | CC BY-SA 4.0 | 1200x798, 303 KB |
| 51 | Sandwip Island | [Small boat, Sandwip.jpg](https://commons.wikimedia.org/wiki/File:Small_boat,_Sandwip.jpg) | Rahat | CC BY-SA 3.0 | 1200x900, 223 KB |
| 52 | Banshkhali Sea Beach | [Banshkhali Sea Beach 02.jpg](https://commons.wikimedia.org/wiki/File:Banshkhali_Sea_Beach_02.jpg) | Al Riaz Uddin | CC BY-SA 4.0 | 1200x900, 175 KB |
| 53 | Banshkhali Eco-Park | [Eco Park 003.jpg](https://commons.wikimedia.org/wiki/File:Eco_Park_003.jpg) | Azim Al Jabber | CC BY-SA 3.0 | 1152x864, 66 KB |
| 54 | Chunati Wildlife Sanctuary | [Fisherman in Chunati Wildlife Sanctuary.jpg](https://commons.wikimedia.org/wiki/File:Fisherman_in_Chunati_Wildlife_Sanctuary.jpg) | Asif Chowdhury Sadi | CC BY-SA 4.0 | 1200x1500, 751 KB |
| 55 | Rangkut Banasram, Ramu | [Rangkut Banasram Pilgrimage Monastery (9) 09.jpg](https://commons.wikimedia.org/wiki/File:Rangkut_Banasram_Pilgrimage_Monastery_(9)_09.jpg) | Rocky Masum | CC BY-SA 4.0 | 1200x900, 460 KB |
| 56 | Sonadia Island | [Sonadia Beach, (photo-Zahirul Islam-MLA).jpg](https://commons.wikimedia.org/wiki/File:Sonadia_Beach,_(photo-Zahirul_Islam-MLA).jpg) | Zislam1968 | CC BY-SA 4.0 | 1200x800, 119 KB |
| 57 | Kutubdia Lighthouse | [Kutubdia lighthouse.jpg](https://commons.wikimedia.org/wiki/File:Kutubdia_lighthouse.jpg) | Eblehe | CC BY-SA 3.0 | 1200x800, 44 KB |
| 58 | Shah Porir Dwip | [Shah Porir Island 03.jpg](https://commons.wikimedia.org/wiki/File:Shah_Porir_Island_03.jpg) | Rocky Masum | CC BY-SA 4.0 | 1200x675, 169 KB |
| 59 | Teknaf Wildlife Sanctuary | [Teknaf Wildlife Sanctuary beside Naf River.jpg](https://commons.wikimedia.org/wiki/File:Teknaf_Wildlife_Sanctuary_beside_Naf_River.jpg) | Ashif Anam Siddique | CC BY-SA 4.0 | 1200x900, 134 KB |
| 60 | Keokradong | [Keokradong Top.jpg](https://commons.wikimedia.org/wiki/File:Keokradong_Top.jpg) | Fahimhasan | CC BY-SA 3.0 | 1200x465, 39 KB |
| 61 | Nilachal | [নীলাচল-৪.jpg](https://commons.wikimedia.org/wiki/File:%E0%A6%A8%E0%A7%80%E0%A6%B2%E0%A6%BE%E0%A6%9A%E0%A6%B2-%E0%A7%AA.jpg) | Tutul Chowdhury | CC BY-SA 4.0 | 1200x633, 343 KB |
| 62 | Amiakhum Waterfall | [Amiakhum Waterfall.jpg](https://commons.wikimedia.org/wiki/File:Amiakhum_Waterfall.jpg) | Rocky Masum | CC BY-SA 4.0 | 1200x900, 428 KB |
| 63 | Rijuk Waterfall | [ঋজুক জলপ্রপাত.jpg](https://commons.wikimedia.org/wiki/File:%E0%A6%8B%E0%A6%9C%E0%A7%81%E0%A6%95_%E0%A6%9C%E0%A6%B2%E0%A6%AA%E0%A7%8D%E0%A6%B0%E0%A6%AA%E0%A6%BE%E0%A6%A4.jpg) | Nipun Paul(nx4338) | CC BY-SA 4.0 | 1200x900, 428 KB |
| 64 | Ram Jadi | [Rama Zadi Temple (01).jpg](https://commons.wikimedia.org/wiki/File:Rama_Zadi_Temple_(01).jpg) | Hasib | CC BY-SA 4.0 | 1200x1646, 188 KB |
| 65 | Prantik Lake | [Prantik Lake, Bandarban.jpg](https://commons.wikimedia.org/wiki/File:Prantik_Lake,_Bandarban.jpg) | SM Sawash | CC BY-SA 4.0 | 1200x1600, 277 KB |
| 66 | Sajek Valley | [Views from Sajek. (40700496984).jpg](https://commons.wikimedia.org/wiki/File:Views_from_Sajek._(40700496984).jpg) | Shadman Samee from Dhaka, Bangladesh | CC BY-SA 2.0 | 1200x782, 245 KB |
| 67 | Rajban Vihara | [RajbanViharaRangamati.jpg](https://commons.wikimedia.org/wiki/File:RajbanViharaRangamati.jpg) | Souvik.arko | Public domain | 1200x900, 175 KB |
| 68 | Kaptai National Park | [Dear Kaptai.jpg](https://commons.wikimedia.org/wiki/File:Dear_Kaptai.jpg) | Arifinikram | CC BY-SA 4.0 | 1200x438, 123 KB |
| 69 | Polwel Park | [Polwel Park.jpg](https://commons.wikimedia.org/wiki/File:Polwel_Park.jpg) | Al Riaz Uddin | CC BY-SA 4.0 | 1200x675, 280 KB |
| 70 | Alutila Cave | [Cave painting.jpg](https://commons.wikimedia.org/wiki/File:Cave_painting.jpg) | Swarup Biswas | CC BY-SA 4.0 | 1200x800, 99 KB |
| 71 | Khagrachari Hill District Council Park | [Khagrachari HDCH Park (01).jpg](https://commons.wikimedia.org/wiki/File:Khagrachari_HDCH_Park_(01).jpg) | Moheen Reeyad | CC BY-SA 4.0 | 1200x800, 189 KB |
| 72 | Shantipur Aranya Kutir | [বুদ্ধ মুক্তি.JPG](https://commons.wikimedia.org/wiki/File:%E0%A6%AC%E0%A7%81%E0%A6%A6%E0%A7%8D%E0%A6%A7_%E0%A6%AE%E0%A7%81%E0%A6%95%E0%A7%8D%E0%A6%A4%E0%A6%BF.JPG) | Aumit22 | CC BY-SA 4.0 | 1200x676, 101 KB |
| 73 | Shalban Vihara | [Shalvan Vihara (15108060312).jpg](https://commons.wikimedia.org/wiki/File:Shalvan_Vihara_(15108060312).jpg) | Toufique E Joarder | CC BY 2.0 | 1200x709, 180 KB |
| 74 | Mainamati War Cemetery | [Mainamati War Cemetery in 2022.01.jpg](https://commons.wikimedia.org/wiki/File:Mainamati_War_Cemetery_in_2022.01.jpg) | CAPTAIN RAJU | CC BY-SA 4.0 | 1200x1600, 760 KB |
| 75 | Mainamati Museum | [Moynamoti jadugar.jpg](https://commons.wikimedia.org/wiki/File:Moynamoti_jadugar.jpg) | Jahirul jitu | CC BY-SA 4.0 | 1200x900, 95 KB |
| 76 | Kotila Mura | [কোটিলা মুড়া ১.png](https://commons.wikimedia.org/wiki/File:%E0%A6%95%E0%A7%8B%E0%A6%9F%E0%A6%BF%E0%A6%B2%E0%A6%BE_%E0%A6%AE%E0%A7%81%E0%A6%A1%E0%A6%BC%E0%A6%BE_%E0%A7%A7.png) | Sabilaenun | CC BY 3.0 | 680x452, 65 KB |
| 77 | Dharmasagar | [Dharmasagar (2).jpg](https://commons.wikimedia.org/wiki/File:Dharmasagar_(2).jpg) | Ferdous | CC BY-SA 4.0 | 1200x900, 135 KB |
| 78 | Jagannath Temple (Sateroratna Mandir) | [Comilla Jagannath Temple.jpg](https://commons.wikimedia.org/wiki/File:Comilla_Jagannath_Temple.jpg) | Layard, Frederic Peter | Public domain | 955x712, 104 KB |
| 79 | Shah Shuja Mosque | [মাদ্রাসা ছাত্ররা.jpg](https://commons.wikimedia.org/wiki/File:%E0%A6%AE%E0%A6%BE%E0%A6%A6%E0%A7%8D%E0%A6%B0%E0%A6%BE%E0%A6%B8%E0%A6%BE_%E0%A6%9B%E0%A6%BE%E0%A6%A4%E0%A7%8D%E0%A6%B0%E0%A6%B0%E0%A6%BE.jpg) | A.h.emonreza | CC BY-SA 4.0 | 1200x800, 141 KB |
| 80 | Kal Bhairab Temple | [Kal Bhairab in Brahmanbaria, Bangladesh-2.jpg](https://commons.wikimedia.org/wiki/File:Kal_Bhairab_in_Brahmanbaria,_Bangladesh-2.jpg) | Subrata Roy | CC BY-SA 3.0 | 1200x900, 161 KB |
| 81 | Arifil Mosque | [আড়িফাইল মসজিদ 03.jpg](https://commons.wikimedia.org/wiki/File:%E0%A6%86%E0%A6%A1%E0%A6%BC%E0%A6%BF%E0%A6%AB%E0%A6%BE%E0%A6%87%E0%A6%B2_%E0%A6%AE%E0%A6%B8%E0%A6%9C%E0%A6%BF%E0%A6%A6_03.jpg) | Mohammad Hedayet Sarker | CC BY-SA 4.0 | 1200x595, 159 KB |
| 82 | Molhead, Chandpur | [Chandpur Boro Station.jpg](https://commons.wikimedia.org/wiki/File:Chandpur_Boro_Station.jpg) | DelwarHossain | CC BY-SA 4.0 | 1200x1200, 60 KB |
| 83 | Hajiganj Bara Mosque | [Hajiganj bror mosjid full photo.jpg](https://commons.wikimedia.org/wiki/File:Hajiganj_bror_mosjid_full_photo.jpg) | MahbubPathan | CC BY-SA 4.0 | 1200x675, 150 KB |
| 84 | Nijhum Dwip | [Nijhum Dwip.jpg](https://commons.wikimedia.org/wiki/File:Nijhum_Dwip.jpg) | Md Saiful Islam Khan (Aopu) | CC BY-SA 4.0 | 1200x795, 130 KB |
| 85 | Bazra Shahi Mosque | [Bazra Shahi Mosque 2.jpg](https://commons.wikimedia.org/wiki/File:Bazra_Shahi_Mosque_2.jpg) | Kishorsopnoneel | CC BY-SA 4.0 | 1200x900, 201 KB |

### Photo choices worth knowing

- **Better than the first suggestion:**
  - Foy's Lake (#5): a 1600 px CC0 photo instead of a 600 px one from 2003.
  - Jadipai (#21): 2209 px instead of 540 px.
  - Kaptai National Park (#68): from the park's own Commons category, instead of a 500 × 332 file.
  - Nilachal (#61): the viewpoint, instead of a near-black sunset.
  - Banshkhali Eco-Park (#53): confirmed in Commons' "Banshkhali Eco-park" category.
  - Chittagong Zoo (#40), Kattali (#41), Mainamati Museum (#75), Bayazid Bostami (#31): better images from their Commons categories than the research picks (a signboard, black-and-white roots, a gate wall, prayer trees).
- **Nilgiri (#8):** in the research, the only free result was a topographic map. Searching "Nilgiri Bandarban" found Nilgiri Hill Resort photos.
- **Still small:**
  - Kotila Mura (#76): 680 × 452. There's no larger free photo.
  - Holy Rosary Cathedral (#35): 800 × 1000.
  - Zia Memorial Museum (#36): 961 × 643.
- **Comilla Jagannath Temple (#78)** uses an old public-domain engraving. There's no free modern photo.
- **Teknaf Beach (#13)** uses Wikidata's own photo for Teknaf Beach, which shows Lengurbill beach on the Teknaf coast.
- **Portrait photos get tall:** 1200 px wide means up to about 2100 px tall and 400–760 KB, e.g. #45, #48, #54, #74. The panel only shows a 250 px-high crop, so capping height at 1200 as well would save about half of those bytes. I didn't do it, because the pipeline you specified limits width only.

## Places still using the placeholder

| # | Attraction | Why |
|---|---|---|
| 26 | Khyang Para | No freely licensed photo on Wikimedia Commons (searched English and Bengali names). The old photo had no known source, so it was removed. |

### Candidates not added

Only the ✅ candidates were approved. These 24 were not added:

| Status | Candidate | Reason (from the research) |
|---|---|---|
| ⚠️ | Shah Amanat Shrine | Photo verified (shrine gate at night). No coordinates: Wikidata only has the airport and the bridge named after him, and OSM only has shops on streets named after him. Needs a manual point in central Chattogram. |
| ⚠️ | Bangabandhu Tunnel (Karnaphuli Tunnel) | Infrastructure rather than a sightseeing spot, and the point is mid-river. The only free photo is the nameplate at night. The official name may have changed since 2024; verify before using. |
| ⚠️ | Guliakhali Sea Beach | Photo verified (the grassy tidal flats). The only point is Guliakhali village; the beach is about 1–2 km west, so the pin is approximate. |
| ❌ | Pandit Vihara | The site's exact location is disputed by historians and there's no free photo. |
| ⚠️ | Ramu Central Sima Vihara | Point is the OSM temple. The photo file is just "Ramu.JPG" (a Burmese-style wooden monastery), so it may be a different Ramu temple. |
| ⚠️ | Aggameda Khyang | A known landmark in Cox's Bazar town, but neither OSM nor Wikidata has it and Commons has no free photo. Needs a manual point and photo, or drop it. |
| ❌ | Marine Drive (Cox's Bazar–Teknaf) | An 80 km road, not a single place. Inani and Himchari already sit on it. |
| ⚠️ | Adinath Temple | The point is right. The photo, though named "Moheshkhali adinath temple", shows a golden Buddhist pagoda, not the Shiva temple, so it probably isn't Adinath. |
| ⚠️ | Mathin's Well | Photo verified. No coordinates in OSM or Wikidata (the well is inside the Teknaf police station compound). Needs a manual point. |
| ⚠️ | Medha Kachhapia National Park | OSM and Wikidata are 10.4 km apart. The OSM point is the centre of the mapped park boundary, so it is probably the better one; verify before use. |
| ⚠️ | Chhera Island | The southern tip of Saint Martin's Island (existing #24, about 3.6 km away). Could be mentioned in that entry instead of added. |
| ⚠️ | Debotakhum | Photo verified. Wikidata has the item but no coordinates, and OSM has nothing. Needs a manual point (Roangchhari). |
| ❌ | Remakri | The Wikidata match is Remakri Union (an administrative area), and the OSM match is the canal. It overlaps Nafakhum (existing #23, on the same canal, 2.5 km away). |
| ⚠️ | Chairman Lake (Lama) | Little-known. The point reverse-geocodes to Cox's Bazar District, right on the Bandarban border (Aziznagar, Lama). |
| ❌ | Konglak Hill | Part of Sajek Valley (1.8 km apart). Better mentioned in the Sajek entry. |
| ⚠️ | Shuvolong Waterfall | The point is the OSM Shuvolong Hill peak. The falls are nearby on the Kaptai Lake shore, so the pin is approximate. |
| ⚠️ | Chakma Rajbari | Point confirmed (an OSM "Rajbari" attraction 0.2 km from Wikidata). No free photo: the search result was the other Chakma palace, in Rangunia. |
| ⚠️ | Richhang Waterfall | Usually spelled Risang. The photo (Category:Risang Waterfall) is fine, but the location isn't (two OSM points 4 km apart; details in the candidates document). |
| ⚠️ | Debta Pukur (Mathai Pukhiri) | No coordinates anywhere, and no free photo (one rejected: it is labelled Bandarban, not Khagrachari). Needs manual research, or drop it. |
| ⚠️ | Gandhi Ashram | Photo verified. No coordinates in OSM or Wikidata (Joyag, Sonaimuri). Needs a manual point. |
| ⚠️ | Muhuri Project | The sluice gate is on the Feni/Chattogram line; OSM puts this point on the Mirsharai side. Pick which district to list it under. |
| ⚠️ | Fort of Shamsher Gazi | The point is right. The item's photo looks like a modern building, so check it shows the fort's remains. |
| ❌ | Khoa Sagar Dighi | Nothing in OSM, Wikidata or Commons. |
| ❌ | Mazu Chowdhury Hat | Nothing in OSM, Wikidata or Commons. Lakshmipur has no well-documented attraction in these sources. |

## Schema and UI changes

- **Newly optional fields:**
  - `entryFee`, `openingHours`, `facilities`: a missing value hides its row, and the hours/fee row disappears when both are unknown.
  - `images` + `photoCredit`: always together.
  - `moreInfoLink`: an English or Bengali Wikipedia article. With none, there's no Learn More button.
- **`photoCredit`:** `{ author, license, sourceUrl }`. It shows as a credit line under the photo, linking to the Commons file page. A new `AttractionPhoto` component hides the credit if the photo fails to load and the placeholder shows instead.
- **Clustering** (`react-leaflet-cluster` 4.1.3):
  - Individual pins keep their category colors, and clusters are neutral slate bubbles with a count.
  - Enter or Space on a focused cluster zooms in.
  - The selected pin is kept out of the clusters so it never disappears.
- **Home view:** the map opens fitted to all attractions. The new places reach Brahmanbaria (24.07°N) and Chandpur (90.64°E), which needs zoom 7 on a laptop. So `MIN_ZOOM` is 7, and `MAX_BOUNDS` is widened to 16.5–28.5°N, 81–103°E, which still exceeds a 1920 × 1080 view at zoom 7.
- **Tests** now cover:
  - required and optional fields and their types;
  - images and credits appearing together;
  - the credit's shape, free license and Commons URL;
  - English or Bengali Wikipedia links;
  - no unused files in `public/images`.

## Verification

- `npm run lint` clean, `npm run build` clean, `npm test` 679 passed.
- **Headless Chrome, production build and dev (StrictMode), 1366 × 800 and 390 × 844:**
  - on load, pins plus cluster counts equal 84;
  - they always equal the results badge under category filters and search ("Bandarban" finds 18);
  - Enter on a cluster zooms in;
  - the selected pin stays visible when zoomed out, and Escape returns to the home view;
  - credit lines link to the right Commons pages;
  - Khyang Para shows the placeholder with no credit;
  - Meghla shows no fee or hours row;
  - no console errors or warnings.

## Follow-ups

1. **Fees and hours for the original 27.** Their entry fees and opening hours came with the original data and have no recorded source. They're still shown. Verify them, or remove them under the same rule as Meghla's.
2. **The ⚠️ candidates** above could be added once someone places a pin by hand (Shah Amanat Shrine, Mathin's Well, Debotakhum, Gandhi Ashram and others) or checks the doubtful photo or location.
3. **Portrait photos:** consider capping height at 1200 px (see Photo choices).
