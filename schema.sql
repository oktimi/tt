-- Valuo 体育新闻平台 数据库表设计
-- 执行: mysql -u root -p < schema.sql

CREATE DATABASE IF NOT EXISTS valuo_sports CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE valuo_sports;

-- 文章表
CREATE TABLE articles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  slug VARCHAR(255) NOT NULL UNIQUE,
  title VARCHAR(500) NOT NULL,
  content MEDIUMTEXT NOT NULL,
  type ENUM('news', 'report', 'analysis') NOT NULL DEFAULT 'news',
  league VARCHAR(50),
  team_a VARCHAR(100),
  team_b VARCHAR(100),
  score VARCHAR(20),
  match_date DATE,
  image_url VARCHAR(500),
  image_alt VARCHAR(500),
  meta_title VARCHAR(200),
  meta_description VARCHAR(500),
  status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  published_at TIMESTAMP NULL,
  INDEX idx_slug (slug),
  INDEX idx_league_date (league, match_date),
  INDEX idx_status (status)
) ENGINE=InnoDB;

-- 赛事表
CREATE TABLE matches (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  league VARCHAR(50) NOT NULL,
  team_a VARCHAR(100) NOT NULL,
  team_b VARCHAR(100) NOT NULL,
  score_a INT DEFAULT 0,
  score_b INT DEFAULT 0,
  match_time DATETIME NOT NULL,
  status ENUM('scheduled', 'live', 'finished') DEFAULT 'scheduled',
  venue VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_league_time (league, match_time),
  INDEX idx_status (status)
) ENGINE=InnoDB;

-- 球员数据表
CREATE TABLE players (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  team VARCHAR(100),
  league VARCHAR(50),
  position VARCHAR(50),
  stats JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_team (team),
  INDEX idx_league (league)
) ENGINE=InnoDB;

-- 足球积分榜
CREATE TABLE football_standings (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  league VARCHAR(50) NOT NULL,
  season VARCHAR(20) NOT NULL,
  team VARCHAR(100) NOT NULL,
  position INT NOT NULL,
  played INT DEFAULT 0,
  won INT DEFAULT 0,
  drawn INT DEFAULT 0,
  lost INT DEFAULT 0,
  goals_for INT DEFAULT 0,
  goals_against INT DEFAULT 0,
  goal_diff INT DEFAULT 0,
  points INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_league_season_team (league, season, team),
  INDEX idx_league_season (league, season)
) ENGINE=InnoDB;

-- 篮球排行榜
CREATE TABLE basketball_standings (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  league VARCHAR(50) NOT NULL,
  season VARCHAR(20) NOT NULL,
  conference VARCHAR(50),
  team VARCHAR(100) NOT NULL,
  position INT NOT NULL,
  won INT DEFAULT 0,
  lost INT DEFAULT 0,
  win_pct DECIMAL(4,3) DEFAULT 0,
  games_behind DECIMAL(4,1) DEFAULT 0,
  streak VARCHAR(10),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_league_season_team (league, season, team),
  INDEX idx_league_season (league, season)
) ENGINE=InnoDB;

-- 热门赛事
CREATE TABLE hot_events (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  league VARCHAR(50) NOT NULL,
  event_type ENUM('match', 'tournament', 'transfer', 'other') DEFAULT 'match',
  start_time DATETIME,
  end_time DATETIME,
  image_url VARCHAR(500),
  link VARCHAR(500),
  priority INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_active_priority (is_active, priority DESC)
) ENGINE=InnoDB;

-- 钩子组件配置表
CREATE TABLE hook_configs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  hook_type VARCHAR(50) NOT NULL,
  match_id BIGINT,
  config JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE SET NULL
) ENGINE=InnoDB;
