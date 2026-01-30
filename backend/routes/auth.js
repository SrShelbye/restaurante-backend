const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const supabase = require('../config/database');

const JWT_SECRET =
  process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware para verificar token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    try {
      // Obtener usuario de Supabase
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', decoded.userId)
        .single();

      if (error || !user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(500).json({
        success: false,
        message: 'Authentication error'
      });
    }
  });
};

// Registro de usuario (endpoint que faltaba)
const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      username,
      password,
      samePassword,
      numPhone
    } = req.body;

    // Validaciones básicas
    if (!firstName || !lastName || !email || !username || !password) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    if (password !== samePassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }

    // Verificar si el usuario ya existe
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .or(`username.eq.${username},email.eq.${email}`)
      .single();

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this username or email already exists'
      });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario en Supabase
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        username,
        password: hashedPassword,
        phone: numPhone,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (createError) {
      console.error('Create user error:', createError);
      return res.status(500).json({
        success: false,
        message: 'Error creating user'
      });
    }

    // Generar token
    const token = jwt.sign(
      { userId: newUser.id, username: newUser.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Responder con éxito (adaptado al formato esperado)
    res.json({
      success: true,
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name
      },
      currentRestaurant: null // Por ahora, ya que no hay restaurantes configurados
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration'
    });
  }
};

// Login de usuario
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Buscar usuario
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .or(`username.eq.${username},email.eq.${username}`)
      .single();

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generar token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Responder con éxito
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name
      },
      currentRestaurant: null
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
};

// Renovar token
const renew = async (req, res) => {
  try {
    // Este endpoint necesita autenticación
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    // Verificar token actual
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      }

      // Obtener usuario actualizado
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', decoded.userId)
        .single();

      if (error || !user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      // Generar nuevo token
      const newToken = jwt.sign(
        { userId: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        token: newToken,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name
        },
        currentRestaurant: null
      });
    });
  } catch (error) {
    console.error('Renew token error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during token renewal'
    });
  }
};

// Logout
const logout = async (req, res) => {
  try {
    // En una implementación real, podríamos invalidar el token
    // Por ahora, simplemente respondemos con éxito
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during logout'
    });
  }
};

module.exports = {
  authenticateToken,
  register,
  login,
  renew,
  logout
};
