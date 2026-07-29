-- Corrige el hash inválido introducido en V7.
-- Contraseña inicial del administrador: Admin123!
UPDATE usuarios
SET password = '$2a$10$yzAJ0Z1U.lIcTJmzIm4PAOsbnTRLqPLw2iI7B8nn/4C3Q8LiqEpK2'
WHERE email = 'uniic_bog@unal.edu.co';
