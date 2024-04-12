cREATE DATABASE rateMyteacher;

USE rateMyteacher;

CREATE TABLE Teachers (
  teacher_id INT PRIMARY KEY,
  name VARCHAR(50),
  email VARCHAR(100) UNIQUE,
  deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE Subjects (
  subject_id INT PRIMARY KEY,
  subject VARCHAR(50) UNIQUE,
  deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE Teacher_Subjects (
  teacher_subject_id INT PRIMARY KEY AUTO_INCREMENT,
  teacher_id INT,
  subject_id INT,
  FOREIGN KEY (teacher_id) REFERENCES Teachers(teacher_id),
  FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id)
);

CREATE TABLE Students (
  student_id INT PRIMARY KEY,
  name VARCHAR(50),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(100),
  approved BOOLEAN DEFAULT FALSE,
  deleted BOOLEAN DEFAULT FALSE
);
ALTER TABLE Students
ADD COLUMN role VARCHAR(20) DEFAULT 'student';
CREATE TABLE Enrollments (
  enrollment_id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT,
  teacher_subject_id INT,
  deleted BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (student_id) REFERENCES Students(student_id),
  FOREIGN KEY (teacher_subject_id) REFERENCES Teacher_Subjects(teacher_subject_id),
  UNIQUE (student_id, teacher_subject_id)
);

CREATE TABLE Ratings (
  rating_id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT,
  teacher_subject_id INT,
  rating_value INT,
  comment TEXT,
  date DATE,
  approved BOOLEAN DEFAULT FALSE,
  deleted BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (student_id) REFERENCES Students(student_id),
  FOREIGN KEY (teacher_subject_id) REFERENCES Teacher_Subjects(teacher_subject_id)
);

CREATE TABLE Student_Ratings (
  rating_id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT,
  rating_value INT,
  comment TEXT,
  date DATE,
  approved BOOLEAN DEFAULT FALSE,
  deleted BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (student_id) REFERENCES Students(student_id)
);