INSERT INTO authors (name, email, bio) 
    VALUES
    ('Ada Lovelace', 'ada@example.com', 'First computer programmer in history.'),
    ('Alan Turing', 'alan@example.com', 'Pioneer of theoretical computer science.');

INSERT INTO posts (author_id, title, content, published) 
    VALUES
    (1, 'Notes on the Analytical Engine', 'Details on algorithmic computing and diagrams.', true),
    (1, 'Computing Machinery and Intelligence', 'Early thoughts on artificial logic.', false),
    (2, 'On Computable Numbers', 'Introduction of the universal Turing machine.', true);