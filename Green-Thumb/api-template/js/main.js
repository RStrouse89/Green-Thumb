//Green Thumb API
document.querySelector('button').addEventListener('click', getFetch)

function getFetch(){
  const choice = document.querySelector('input').value.toLowerCase()

  // console.log(choice)
  const url = `https://perenual.com/api/species-list?key=sk-PU89645324cc70f4d749&q=${choice}`

  // Clear existing data and reset fields --could make a function
  document.querySelector('#pics').style.display = 'none';
  document.querySelector('img').src = '';
  document.querySelector('#descrip').innerText = '';
  document.querySelector('#describe').innerText = '';
  document.querySelector('#wet').innerText = '';
  document.querySelector('#water').innerText = '';
  document.querySelector('#sunny').innerText = '';
  document.querySelector('#sun').innerText = '';
  document.querySelector('#pruning').innerText = '';
  document.querySelector('#prune').innerText = '';

  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        if (data.data.length === 0) {
          console.log('Species not found');
          return;
        }
        // console.log(data)
        const ident = data.data[0].id

        const research = `https://perenual.com/api/species/details/${ident}?key=sk-PU89645324cc70f4d749`
        const nurture =  `https://perenual.com/api/species-care-guide-list?key=sk-PU89645324cc70f4d749&species_id=${ident}`


        //Get descriptions of plants
        fetch(research)
        .then(res => res.json()) // parse response as JSON
        .then(find => {
          // console.log(find)
          document.querySelector('#pics').style.display = 'block';
          document.querySelector('img').src = find.default_image.original_url;
          document.querySelector('#descrip').innerText = "Description"
          document.querySelector('#describe').innerText = find.description;
                    
        })
        .catch(err => {
            console.log(`Error fetching plant description: ${err}`)
        });

        
        //Get care Instructions
        fetch(nurture)
        .then(res => res.json()) // parse response as JSON
        .then(info => {
          console.log(info)
          let watering = "Unknown";
          let sunlight = "Unknown";
          let pruning = "Unknown";

          if (info.data && info.data.length > 0 && info.data[0].section){
            info.data[0].section.forEach(obj => {
              if (obj.type === 'watering') {
                watering = obj.description
              }
              else if (obj.type === 'sunlight') {
                sunlight = obj.description
              } else if (obj.type === 'pruning') {
                pruning = obj.description
            } 
             });
          }
          document.querySelector('#wet').innerText = "Watering Requirements";
          document.querySelector('#water').innerText = watering;
          document.querySelector('#sunny').innerText = "Sunlight Requirements";
          document.querySelector('#sun').innerText = sunlight;
          document.querySelector('#pruning').innerText = "Pruning Recommendations";
          document.querySelector('#prune').innerText = pruning;
        })  

        .catch(err => {
            console.log(`Error fetching care instructions: ${err}`)
        });
  })

      .catch(err => {
          console.log(`Error fetching species: ${err}`)
      });
}
      
