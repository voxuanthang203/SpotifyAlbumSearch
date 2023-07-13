import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  FormControl,
  InputGroup,
  Button,
  Card,
  Row
} from "react-bootstrap";
import { useState, useEffect } from "react";

const CLIENT_ID = "048969c7464e401ba536590827e9b958"
const CLIENT_SECRET = "841c90f5aaa643cea5a15257d4202e01"

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    //API Access Token
    var authParameters = {
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    };

    fetch("https://accounts.spotify.com/api/token", authParameters).then(result => result.json())
    .then(data => setAccessToken(data.access_token))
  }, [])

  //Search
  async function search() {
    console.log("Search for " + searchInput); //Taylor Swift

    //Get request using search to get the Artist ID

    var searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }

    var artistId = await fetch("https://api.spotify.com/v1/search?q=" + searchInput + '&type=artist', searchParameters)
      .then(response => response.json())
      .then(data => {return data.artists.items[0].id})
    
    console.log("Artist ID id: " + artistId);

    //Get request with Artist ID grab all the albums from that artist

    var albums = await fetch(`https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album&market=US&limit=50`, searchParameters)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setAlbums(data.items);
      });

    //Display those albums to the users
  }

  return (
    <div className="App" class="container">
      <Container>
        <InputGroup className="mb-3" size="lg">
          <FormControl
            placeholder="Search For Artist"
            type="input"
            onKeyPress={(event) => {
              if (event.key == "Enter") {
                search();
              }
            }}
            onChange={(event) => {
              setSearchInput(event.target.value);
            }}
          />
          <Button onClick={search}>
            Search
          </Button>
        </InputGroup>
      </Container>
      <Container>
        <Row className="mx-2 row row-cols-4">
          {albums.map((album, i) => {
            console.log(albums)
            return (
              <Card>
                <Card.Img src={album.images[0].url} />
                <Card.Body>
                  <Card.Title>{album.name}</Card.Title>
                </Card.Body>
              </Card>
            )
          })}
        </Row>
      </Container>
    </div>
  );
}

export default App;
