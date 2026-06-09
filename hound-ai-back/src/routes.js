import express from 'express';

const router = express.Router();

router.get('/health', (req, res) => {
    res.json({ status: "Backend rodando perfeitamente!" });
});

export default router;