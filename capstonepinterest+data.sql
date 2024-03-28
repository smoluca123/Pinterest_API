/*
 Navicat Premium Data Transfer

 Source Server         : rdsaws_dev
 Source Server Type    : MySQL
 Source Server Version : 80035 (8.0.35)
 Source Host           : database-1.cjokowi46dtp.ap-southeast-1.rds.amazonaws.com:3306
 Source Schema         : capstonepinterest

 Target Server Type    : MySQL
 Target Server Version : 80035 (8.0.35)
 File Encoding         : 65001

 Date: 29/03/2024 01:53:33
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for auth_code
-- ----------------------------
DROP TABLE IF EXISTS `auth_code`;
CREATE TABLE `auth_code`  (
  `code_id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`code_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of auth_code
-- ----------------------------
INSERT INTO `auth_code` VALUES (1, 'Capstone');

-- ----------------------------
-- Table structure for comments
-- ----------------------------
DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments`  (
  `cmt_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NULL DEFAULT NULL,
  `img_id` int NULL DEFAULT NULL,
  `date` date NULL DEFAULT NULL,
  `content` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`cmt_id`) USING BTREE,
  INDEX `comments_user_id`(`user_id` ASC) USING BTREE,
  INDEX `comments_img_id`(`img_id` ASC) USING BTREE,
  CONSTRAINT `comments_img_id` FOREIGN KEY (`img_id`) REFERENCES `images` (`img_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `comments_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of comments
-- ----------------------------
INSERT INTO `comments` VALUES (10, 4, 17, '2024-03-28', 'Xuất sắc quá');
INSERT INTO `comments` VALUES (11, 9, 18, '2024-03-28', 'Quá ảo');
INSERT INTO `comments` VALUES (12, 10, 15, '2024-03-28', 'qua dep');
INSERT INTO `comments` VALUES (13, 10, 15, '2024-03-28', 'Dep Qua');
INSERT INTO `comments` VALUES (14, 10, 17, '2024-03-28', 'Dep qua');

-- ----------------------------
-- Table structure for images
-- ----------------------------
DROP TABLE IF EXISTS `images`;
CREATE TABLE `images`  (
  `img_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `desc` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`img_id`) USING BTREE,
  INDEX `img_user_id`(`user_id` ASC) USING BTREE,
  CONSTRAINT `img_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 22 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of images
-- ----------------------------
INSERT INTO `images` VALUES (15, 'Pexels Photo', '/img/1711640392017_pexels-photo-4245826.jpeg', 'Pexels Photo Wallpaper', 2);
INSERT INTO `images` VALUES (16, '4k Photo', '/img/1711640412945_8157192.jpg', '4k Photo Wallpaper', 4);
INSERT INTO `images` VALUES (17, 'Jinx v1', '/img/1711640447124_smo.disc1_JINX_League_of_legends_realism_3D_CGI_volumetric_ligh_027d2372-94aa-4e56-8680-4772da422c95.png', 'Jinx v1 Photo', 8);
INSERT INTO `images` VALUES (18, 'Jinx v2 3D', '/img/1711640457569_smo.disc1_JINX_League_of_legends_realism_3D_CGI_volumetric_ligh_d36972d7-47c5-4fa9-a826-63c968084d14.png', 'Jinx v2 3D Photo', 10);

-- ----------------------------
-- Table structure for save_img
-- ----------------------------
DROP TABLE IF EXISTS `save_img`;
CREATE TABLE `save_img`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NULL DEFAULT NULL,
  `img_id` int NULL DEFAULT NULL,
  `date` date NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `saveimg_user_id`(`user_id` ASC) USING BTREE,
  INDEX `saveimg_img_id`(`img_id` ASC) USING BTREE,
  CONSTRAINT `saveimg_img_id` FOREIGN KEY (`img_id`) REFERENCES `images` (`img_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `saveimg_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of save_img
-- ----------------------------
INSERT INTO `save_img` VALUES (3, 10, 15, '2024-03-28');
INSERT INTO `save_img` VALUES (5, 10, 16, '2024-03-28');

-- ----------------------------
-- Table structure for type_user
-- ----------------------------
DROP TABLE IF EXISTS `type_user`;
CREATE TABLE `type_user`  (
  `type_id` int NOT NULL AUTO_INCREMENT,
  `type_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `isAdmin` int NULL DEFAULT NULL,
  PRIMARY KEY (`type_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of type_user
-- ----------------------------
INSERT INTO `type_user` VALUES (1, 'Member', 0);
INSERT INTO `type_user` VALUES (2, 'Administrator', 1);

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `full_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `age` int NULL DEFAULT NULL,
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `type` int NOT NULL DEFAULT 1,
  PRIMARY KEY (`user_id`) USING BTREE,
  INDEX ` type_user`(`type` ASC) USING BTREE,
  CONSTRAINT ` type_user` FOREIGN KEY (`type`) REFERENCES `type_user` (`type_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (2, 'admin@gmail.com', '$2b$10$iRl/IKL77xUvKMmw4ByoZOmc7iB1jrrawegRP3n/HXLEGU4H7j5/G', 'Admin 1', 22, NULL, 2);
INSERT INTO `users` VALUES (3, 'admin2@gmail.com', '$2b$10$iRl/IKL77xUvKMmw4ByoZOmc7iB1jrrawegRP3n/HXLEGU4H7j5/G', 'Admin 2', 22, NULL, 1);
INSERT INTO `users` VALUES (4, 'lucadev1@gmail.com', '$2b$10$iRl/IKL77xUvKMmw4ByoZOmc7iB1jrrawegRP3n/HXLEGU4H7j5/G', 'Luca Dev 1', 22, '', 1);
INSERT INTO `users` VALUES (8, 'lucadev2@gmail.com', '$2b$10$iRl/IKL77xUvKMmw4ByoZOmc7iB1jrrawegRP3n/HXLEGU4H7j5/G', 'Luca Dev 2', 22, '', 1);
INSERT INTO `users` VALUES (9, 'lucadev3@gmail.com', '$2b$10$ow0qf9flvLVYbY.TWBSiz.7lA7.JfZDHNcv1zV7dNto/QjKc.vpGu', 'Luca dev 3', 23, '', 1);
INSERT INTO `users` VALUES (10, 'test1@gmail.com', '$2b$10$iRl/IKL77xUvKMmw4ByoZOmc7iB1jrrawegRP3n/HXLEGU4H7j5/G', 'Changed', 25, '', 1);
INSERT INTO `users` VALUES (11, 'devtest1@gmail.com', '$2b$10$k8Ds9pxTZYWQYD8U5PcWHO5on4wY.eT3U.dpw9ebRZKJCgf5ja5e2', 'Dev Test1', 22, '', 1);
INSERT INTO `users` VALUES (12, 'capstonetest1@gmail.com', '$2b$10$ONDX55thAgMlEDeEnP9ZKe/BAFBeilc4t7bFbpD6l/8emp62WMFoC', 'CApstone', 22, '', 1);

SET FOREIGN_KEY_CHECKS = 1;
