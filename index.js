import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";
import bcrypt from 'bcrypt';
import session from 'express-session';
import dotenv from 'dotenv';
dotenv.config();


const app = express();
const port = Number(process.env.PORT) || 3000;

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

db.connect();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));  

app.get("/", (req,res)=>{
  res.render("index.ejs");
});

app.get('/login', (req, res) => {
  res.render('login.ejs'); 
});

app.get('/signup', (req, res) => {
  res.render('signup.ejs'); 
});

app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const checkQuery = 'SELECT * FROM users WHERE email = $1';
    db.query(checkQuery, [email], (err, results) => {
        if (err) {
            console.error(err);
            return res.send(`<script>alert('Database error during user check'); window.history.back();</script>`);
        }

        if (results.rows.length > 0) {
            return res.send(`<script>alert('User already exists'); window.history.back();</script>`);
        }

        const insertQuery = 'INSERT INTO users (email, password) VALUES ($1, $2)';
        db.query(insertQuery, [email, hashedPassword], (err, result) => {
            if (err) {
                console.error(err);
                return res.send(`<script>alert('Database error during signup'); window.history.back();</script>`);
            }
            return res.redirect('/login');
        });
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const selectQuery = 'SELECT * FROM users WHERE email = $1';

    db.query(selectQuery, [email], async (err, results) => {
        if (err) {
            console.error(err);
            return res.send(`<script>alert('Database error during login'); window.history.back();</script>`);
        }

        if (results.rows.length === 0) {
            return res.send(`<script>alert('Invalid credentials'); window.history.back();</script>`);
        }

        const user = results.rows[0];
        const match = await bcrypt.compare(password, user.password);

        if (match) {
            req.session.user = user;
            res.redirect("/home") // or res.redirect('/dashboard');
        } else {
            return res.send(`<script>alert('Invalid credentials'); window.history.back();</script>`);
        }
    });
});

app.get("/home", async (req, res) => {
  try {
    const response = await axios.get("https://api.jikan.moe/v4/anime");
    const animeList = response.data.data;
    const carouselAnime = animeList.slice(0, 3);
    res.render("home.ejs", {
      data: animeList,
      carousel: carouselAnime,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch anime data");
  }
});

app.get("/search", async(req,res)=>{
  try{
    let anime_name = req.query.search;
    const response = await axios.get(`https://api.jikan.moe/v4/anime?q=${anime_name}`);   
    res.render("search.ejs",{
      anime : anime_name,
      data: response.data.data
    })
  } catch(error){
    console.log(error);
    res.redirect("/home");
  }
})

app.get("/anime/:id", async(req,res)=>{
  try{
    const id = parseInt(req.params.id);
    const response = await axios.get(`https://api.jikan.moe/v4/anime/${id}`);   
    res.render("description.ejs",{
      data: response.data.data
    })
  } catch(error){
    console.log(error);
  }
})

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.log(err);
      return res.redirect('/'); // fallback redirect
    }
    res.clearCookie('connect.sid'); // clear session cookie
    res.redirect('/'); // redirect to home page after logout
  });
});

app.post('/add-to-favorites', async (req, res) => {
  const { anime_id, title, image_url } = req.body;
  const user_id = req.session.user?.id; // Assuming 'id' is the primary key in users table

  if (!user_id) {
    return res.status(401).send(`<script>alert('Please log in to add favorites'); window.location.href='/login';</script>`);
  }

  try {
    // Insert into favorites table (if not already exists)
    await db.query(`
      INSERT INTO favorites (anime_id, title, image_url)
      SELECT $1, $2, $3
      WHERE NOT EXISTS (
        SELECT 1 FROM favorites WHERE anime_id = $1
      );
    `, [anime_id, title, image_url]);

    // Insert mapping to user in maps table (user_id <-> anime_id)
    await db.query(`
      INSERT INTO maps (user_id, anime_id)
      SELECT $1, $2
      WHERE NOT EXISTS (
        SELECT 1 FROM maps WHERE user_id = $1 AND anime_id = $2
      );
    `, [user_id, anime_id]);

    res.redirect('/favorites'); // Or wherever your favorite list is shown
  } catch (err) {
    console.error("Error adding to favorites:", err);
    res.status(500).send(`<script>alert('Error adding to favorites'); window.history.back();</script>`);
  }
});

app.get('/favorites', async (req, res) => {
  const user_id = req.session.user?.id;

  if (!user_id) {
    return res.send(`<script>alert('Please log in to view favorites'); window.location.href='/login';</script>`);
  }

  try {
    const result = await db.query(`
      SELECT f.anime_id, f.title, f.image_url
      FROM favorites f
      JOIN maps m ON f.anime_id = m.anime_id
      WHERE m.user_id = $1;
    `, [user_id]);

    const favorites = result.rows;

    res.render('favorites.ejs', { favorites });
  } catch (err) {
    console.error("Error fetching favorites:", err);
    res.status(500).send(`<script>alert('Error fetching favorites'); window.history.back();</script>`);
  }
});


app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
