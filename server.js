import express from 'express';
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const app = express();
app.use(express.json());

// --- OBJEKTAI ---

app.get('/api/objektai', async (req, res) => {
  try {
    const { rows: objektai } = await pool.query(
      'SELECT * FROM objektas ORDER BY created_at DESC'
    );
    for (const obj of objektai) {
      const { rows: dienos } = await pool.query(
        'SELECT * FROM dienos WHERE objektas_id = $1 ORDER BY date DESC',
        [obj.id]
      );
      for (const d of dienos) {
        const { rows: mats } = await pool.query(
          'SELECT * FROM medziagos WHERE diena_id = $1',
          [d.id]
        );
        d.materials = mats;
      }
      obj.days = dienos;

      const { rows: rez } = await pool.query(
        'SELECT * FROM rezultatas WHERE objektas_id = $1 ORDER BY data DESC',
        [obj.id]
      );
      obj.rezultatai = rez;
    }
    res.json(objektai);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/objektai', async (req, res) => {
  try {
    const b = req.body;
    const { rows } = await pool.query(
      `INSERT INTO objektas (name, address, status, notes, client, client_company, client_code, client_pvm, client_address, client_email, phone)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [b.name, b.address, b.status || 'naujas', b.notes, b.client, b.clientCompany, b.clientCode, b.clientPvm, b.clientAddress, b.clientEmail, b.phone]
    );
    rows[0].days = [];
    rows[0].rezultatai = [];
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/objektai/:id', async (req, res) => {
  try {
    const b = req.body;
    const { rows } = await pool.query(
      `UPDATE objektas SET name=$1, address=$2, status=$3, notes=$4, client=$5, client_company=$6, client_code=$7, client_pvm=$8, client_address=$9, client_email=$10, phone=$11
       WHERE id=$12 RETURNING *`,
      [b.name, b.address, b.status, b.notes, b.client, b.clientCompany, b.clientCode, b.clientPvm, b.clientAddress, b.clientEmail, b.phone, req.params.id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/objektai/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM objektas WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/objektai/:id/status', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'UPDATE objektas SET status=$1 WHERE id=$2 RETURNING *',
      [req.body.status, req.params.id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// --- DIENOS ---

app.post('/api/objektai/:id/dienos', async (req, res) => {
  try {
    const { rows: existing } = await pool.query(
      'SELECT * FROM dienos WHERE objektas_id=$1 AND date=$2',
      [req.params.id, req.body.date]
    );
    if (existing.length > 0) {
      existing[0].materials = [];
      return res.json(existing[0]);
    }
    const { rows } = await pool.query(
      'INSERT INTO dienos (objektas_id, date) VALUES ($1, $2) RETURNING *',
      [req.params.id, req.body.date]
    );
    rows[0].materials = [];
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/dienos/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM dienos WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// --- MEDZIAGOS ---

app.post('/api/dienos/:id/medziagos', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'INSERT INTO medziagos (diena_id, name, quantity) VALUES ($1, $2, $3) RETURNING *',
      [req.params.id, req.body.name, req.body.quantity || 0]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/medziagos/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'UPDATE medziagos SET name=$1, quantity=$2 WHERE id=$3 RETURNING *',
      [req.body.name, req.body.quantity || 0, req.params.id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/medziagos/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM medziagos WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// --- KAMEROS ---

app.get('/api/kameros', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM kameros ORDER BY kameros');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/kameros', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'INSERT INTO kameros (kameros) VALUES ($1) ON CONFLICT (kameros) DO NOTHING RETURNING *',
      [req.body.name]
    );
    res.json(rows[0] || { kameros: req.body.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/kameros/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM kameros WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// --- LAIDAI ---

app.get('/api/laidai', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM laidai ORDER BY laidai');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/laidai', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'INSERT INTO laidai (laidai) VALUES ($1) ON CONFLICT (laidai) DO NOTHING RETURNING *',
      [req.body.name]
    );
    res.json(rows[0] || { laidai: req.body.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/laidai/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM laidai WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// --- REZULTATAS ---

app.get('/api/objektai/:id/rezultatai', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM rezultatas WHERE objektas_id=$1 ORDER BY data DESC',
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/objektai/:id/rezultatai', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'INSERT INTO rezultatas (objektas_id, data, suma) VALUES ($1, $2, $3) RETURNING *',
      [req.params.id, req.body.data, req.body.suma || 0]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/rezultatai/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM rezultatas WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API server running on port ${PORT}`);
});
