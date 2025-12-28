-- Valuo 体育新闻平台 数据库表设计
-- 执行: mysql -u root -p < schema.sql

CREATE DATABASE IF NOT EXISTS valuo_sports CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE valuo_sports;

-- 文章表
CREATE TABLE articles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  slug VARCHAR(255) NOT NULL UNIQUE,           -- SEO友好URL: nba/2025-01-01/lakers-vs-warriors-report
  title VARCHAR(500) NOT NULL,
  content MEDIUMTEXT NOT NULL,                 -- Markdown内容
  type ENUM('news', 'report', 'analysis') NOT NULL DEFAULT 'news',
  league VARCHAR(50),                          -- NBA, 英超, 西甲等
  team_a VARCHAR(100),
  team_b VARCHAR(100),
  score VARCHAR(20),                           -- 102-98
  match_date DATE,
  image_url VARCHAR(500),                      -- R2图片URL
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
  status ENUM('upcoming', 'live', 'finished') DEFAULT 'upcoming',
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
  stats JSON,                                  -- 灵活存储各类统计数据
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_team (team),
  INDEX idx_league (league)
) ENGINE=InnoDB;

-- 钩子组件配置表
CREATE TABLE hook_configs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  hook_type VARCHAR(50) NOT NULL,              -- WINRATE, COMPARE, ODDS, TACTICS
  match_id BIGINT,
  config JSON,                                 -- 组件配置参数
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE SET NULL
) ENGINE=InnoDB;
