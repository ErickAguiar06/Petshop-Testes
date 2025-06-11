const prisma = require('../connect');

// Cadastro de usuário
const create = async (req, res) => {
    const { nome, email, telefone, senha } = req.body;
    console.log('Dados recebidos:', req.body);

    try {
        const usuario = await prisma.usuario.create({
            data: { nome, email, telefone, senha }, // ← ideal criptografar a senha
        });

        console.log('Usuário criado:', usuario);

        // Retorna apenas os dados sem senha
        res.status(201).json({
            message: "Usuário criado com sucesso!",
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                telefone: usuario.telefone
            }
        });
    } catch (err) {
        console.error('Erro ao criar usuário:', err);
        res.status(400).json({ message: "Erro ao criar usuário", error: err });
    }
};

// Login de usuário
const login = async (req, res) => {
    const { email, senha } = req.body;
    console.log('Tentativa de login:', req.body);

    try {
        const usuario = await prisma.usuario.findUnique({
            where: { email },
        });

        if (!usuario) {
            console.log('Usuário não encontrado');
            return res.status(401).json({ message: 'Usuário não encontrado' });
        }

        if (usuario.senha !== senha) {
            console.log('Senha incorreta');
            return res.status(401).json({ message: 'Senha incorreta' });
        }

        console.log('Login bem-sucedido:', usuario);
        res.status(200).json({
            message: 'Login bem-sucedido',
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            }
        });

    } catch (err) {
        console.error('Erro no login:', err);
        res.status(400).json({ message: "Erro no login", error: err });
    }
};

module.exports = {
    create,
    login,
};
