/*
 Navicat Premium Dump SQL

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 80046 (8.0.46)
 Source Host           : localhost:3306
 Source Schema         : truyenaudio

 Target Server Type    : MySQL
 Target Server Version : 80046 (8.0.46)
 File Encoding         : 65001

 Date: 09/07/2026 13:37:51
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for affiliate_link
-- ----------------------------
DROP TABLE IF EXISTS `affiliate_link`;
CREATE TABLE `affiliate_link`  (
  `id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `imageUrl` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of affiliate_link
-- ----------------------------
INSERT INTO `affiliate_link` VALUES ('21ce6d64-0b47-4b87-bb46-d910a7612966', 'https://www.youtube.com/watch?v=IIS-FhK9N9c', 'www.youtube.com', NULL, NULL, 1, '2026-07-09 13:03:24.447', '2026-07-09 13:03:24.000');

-- ----------------------------
-- Table structure for bookmark
-- ----------------------------
DROP TABLE IF EXISTS `bookmark`;
CREATE TABLE `bookmark`  (
  `id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `novelId` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `Bookmark_userId_novelId_key`(`userId`, `novelId`) USING BTREE,
  INDEX `Bookmark_novelId_fkey`(`novelId`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of bookmark
-- ----------------------------
INSERT INTO `bookmark` VALUES ('2f3bad03-4628-4c70-94cd-dfb8aaf64847', 'b99f39d8-1476-4146-a5fd-156bfc20f71b', 'hop-hoan-tong-cam-tieu-thu-cung-tong-5332', '2026-07-08 17:31:57.050');

-- ----------------------------
-- Table structure for chapter
-- ----------------------------
DROP TABLE IF EXISTS `chapter`;
CREATE TABLE `chapter`  (
  `id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `novelId` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `chapterNumber` int NOT NULL,
  `isLocked` tinyint(1) NOT NULL DEFAULT 0,
  `price` int NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `audioUrl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `Chapter_novelId_chapterNumber_key`(`novelId`, `chapterNumber`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of chapter
-- ----------------------------
INSERT INTO `chapter` VALUES ('c72c832d-88ac-4124-9351-1be3c4b59254', '53320ce2-36f2-4137-aec5-1e691bde53d9', 'hahahaha', 'Sau khi Đường Giảo bái nhập Hợp Hoan Tông, chăm chỉ khắc khổ, học một đống lí thuyết, vẫn chưa được thực hành.\n\nChờ mãi mới đến tuổi trưởng thành, sư tỷ mang theo nàng tham gia Đàn Môn yến, chỉ vào một dàn nam nhân bảo nàng chọn.\n\nTrên tòa có một vị kiếm tu, mặt mày sáng sủa, y phục mỏng nhẹ, thanh dật thản nhiên, y như một trích tiên, trái tim Đường Giảo manh động, giả bộ ngã vào lòng ngực hắn, lanh lẹ treo túi thơm lên chuôi kiếm của hắn, hai mắt rưng rưng xin lỗi, lỗ tai đỏ lên, bước từng bước lưu luyến rời đi.\n\nKiếm tu rất biết điều, màn đêm buông xuống liền theo địa chỉ được thêu trên túi thơm tìm đến.\n\nHai người trò chuyện vui vẻ với nhau, tình ý dâng trào, vô cùng ăn ý, Đường Giảo vừa mới đưa tay ôm lấy eo hắn, cánh tay kiếm tu đã vòng qua eo nàng rồi.\n\nVành tai chạm vào tóc mai, Đường Giảo xích nhẹ ra một chút, mềm giọng hỏi hắn tên họ là gì, tu sĩ của môn phái nào.\n\nKiếm tu hôn khóe môi nàng, giọng nói khàn khàn: \"Từ Trầm Vân, Hợp Hoan Tông\"\n\nĐường Giảo bừng tỉnh.\n\nĐường Giảo đẩy hắn ra.\n\nTừ Trầm Vân: ...?\n\nĐường Giảo nhanh chóng mặc áo ngoài vào, ngồi nghiêm chỉnh, dáng vẻ đoan trang.\n\nSau đó nàng cười gượng hai tiếng, nói: \"Haha, trùng hợp ghê, thì ra là đại sư huynh\"\n\nNàng gia nhập vào Hợp Hoan Tông mới có 3-4 năm, còn chưa gặp vị đại sư huynh bế quan 10 năm này.\n\nMọi người đều biết, Hợp Hoan Tông cấm tiêu thụ cùng tông.\n\nBởi vì công pháp giống nhau, cho nên không thể hỗ trợ nhau tu luyện được.\n\nTuy rằng hai bên đều là hình mẫu của nhau, nhưng Đường Giảo và Từ Trầm Vân vẫn quyết định buông tha cho đối phương.\n\nNhưng mà dù sao là đồng môn, có đôi khi không muốn gặp là có thể không gặp được.\n\nVí dụ như:\n\nĐường Giảo vừa mới đến gần một Đan tu, Từ Trầm Vân đã dán bên tai nàng, tha thiết khuyên bảo: \"Sư muôi, tên Đan tu này nhìn hơi đần, tu vi chắc không được cao lắm đâu, đổi người khác đi?\"\n\nLại ví dụ như:\n\nTừ Trầm Vân mời một vị nữ Kiếm tu đi chung với nhau, Đường Giảo khoanh tay trước ngực, nhẹ giọng cười với hắn: \"Sư huynh, nếu huynh thích kiểu này, không phải muội tốt hơn sao?\"\n\nMột đoạn thời gian sau, cả hai người đều không tìm được đối tượng thích hợp.\n\nRơi vào đường cùng, Đường Giảo và Từ Trầm Vân trải qua một cuộc nói chuyện nghiêm túc, quyết định hay là thử xem.\n\nNhưng mà... ai có thể nói cho nàng biết, đệ tử Hợp Hoan Tông với đệ tử Hợp Hoan Tông tu luyện như thế nào bây giờ?\n\nTiểu sư muội x Đại sư huynh\n\nNữ chính trông có vẻ ngây thơ đáng yêu, nam chính trông thanh nhã cao khiết, thế nên cả hai đều bị lừa.\n\nNữ chính là \"bạch thiết hắc\" (bề ngoài ngây thơ bên trong đen tối), ngọt ngào.\n\nTu luyện theo kiểu \"chân trái đạp chân phải bay lên trời\", xin đừng đào sâu logic.', 1, 0, 0, '2026-07-06 13:10:36.612', '2026-07-08 17:34:53.000', '/api/media/4cfa92a8-666f-4110-a870-7db306861d9d.mp3');
INSERT INTO `chapter` VALUES ('7e7c8879-2df9-4a1b-9377-6a6a6e115704', '53320ce2-36f2-4137-aec5-1e691bde53d9', 'hahahaha', '123', 2, 1, 3, '2026-07-06 14:02:56.657', '2026-07-08 17:35:01.000', '/api/media/49417b81-d7ad-400d-aeda-75e0d79a8993.mp3');
INSERT INTO `chapter` VALUES ('8d639f30-5374-41fc-a7ec-ddb6ae4e7039', 'effe60b5-0340-4064-9667-aa7512797a0f', '1', NULL, 1, 1, 1, '2026-07-06 14:16:10.902', '2026-07-09 12:36:50.000', '/api/media/d116b9f8-88ce-4c33-9318-4bab76d0cd1f.mp3');
INSERT INTO `chapter` VALUES ('92929a36-0b80-4ed8-ac11-f54c2103feef', 'f0a1d369-001b-457b-84a4-81fa9a908c4e', '1', NULL, 1, 1, 1, '2026-07-06 14:16:26.816', '2026-07-09 12:36:55.000', '/api/media/f138baec-9921-4a19-b662-eeb737e07e9c.mp3');
INSERT INTO `chapter` VALUES ('42be9a6a-1bbd-463e-8444-92edcb03be0e', '5e8bf72a-24a1-4449-9ad5-7be082c34c28', '1', NULL, 1, 0, 0, '2026-07-06 14:16:43.923', '2026-07-09 13:29:10.000', '/api/media/317e37a7-4fab-45f7-8faf-ec387d0b427f.mp3');
INSERT INTO `chapter` VALUES ('315a4a27-cddb-4742-a83a-7e4d6bb63b33', '94247be9-1da8-4c62-9197-1c17f4223631', '1', NULL, 1, 1, 1, '2026-07-06 14:16:57.322', '2026-07-09 13:27:38.000', '/api/media/3ea625f5-1504-41b6-9064-337a61ac4877.mp3');
INSERT INTO `chapter` VALUES ('15c5a8df-a15d-4bab-8b46-8bac76a64681', '5e8bf72a-24a1-4449-9ad5-7be082c34c28', '2', '2', 2, 1, 1, '2026-07-09 13:28:59.231', '2026-07-09 13:28:59.000', NULL);
INSERT INTO `chapter` VALUES ('15e5a903-2552-4c25-a2fc-5543132aab1a', '5e8bf72a-24a1-4449-9ad5-7be082c34c28', '3', '3', 3, 1, 1, '2026-07-09 13:29:07.113', '2026-07-09 13:29:07.000', NULL);

-- ----------------------------
-- Table structure for comment
-- ----------------------------
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment`  (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `novelId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `chapterNumber` int NULL DEFAULT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `createdAt` datetime(3) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of comment
-- ----------------------------
INSERT INTO `comment` VALUES ('3de7529f-58d4-4d35-ad6f-283ec7c1eb9e', 'b99f39d8-1476-4146-a5fd-156bfc20f71b', '53320ce2-36f2-4137-aec5-1e691bde53d9', 1, 'hay', '2026-07-08 17:42:50.445');
INSERT INTO `comment` VALUES ('3ee9aafe-fae4-43a9-b672-78faf8f81d64', 'b99f39d8-1476-4146-a5fd-156bfc20f71b', '53320ce2-36f2-4137-aec5-1e691bde53d9', 2, '123', '2026-07-08 17:42:56.147');
INSERT INTO `comment` VALUES ('9dd86532-a578-4621-b0f3-aa813cc892be', 'b99f39d8-1476-4146-a5fd-156bfc20f71b', '53320ce2-36f2-4137-aec5-1e691bde53d9', 1, '123', '2026-07-06 15:00:14.862');

-- ----------------------------
-- Table structure for genre
-- ----------------------------
DROP TABLE IF EXISTS `genre`;
CREATE TABLE `genre`  (
  `id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `Genre_name_key`(`name`) USING BTREE,
  UNIQUE INDEX `Genre_slug_key`(`slug`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of genre
-- ----------------------------
INSERT INTO `genre` VALUES ('fbd65ad3-37b3-42ea-9fec-01a9d5b0acbc', 'Kiếm hiệp', 'kiem-hiep');
INSERT INTO `genre` VALUES ('9636b60c-0583-4836-b151-63520ea51558', 'Khoa huyễn', 'khoa-huyen');
INSERT INTO `genre` VALUES ('114adfd0-5402-49d7-995f-da68d478df48', 'Tiên hiệp', 'tien-hiep');

-- ----------------------------
-- Table structure for liked_novel
-- ----------------------------
DROP TABLE IF EXISTS `liked_novel`;
CREATE TABLE `liked_novel`  (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `novelId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `createdAt` datetime(3) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `unique_user_novel_like`(`userId` ASC, `novelId` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of liked_novel
-- ----------------------------
INSERT INTO `liked_novel` VALUES ('b55f5131-f219-4b5a-82b2-af2c6d634ab5', 'b99f39d8-1476-4146-a5fd-156bfc20f71b', '53320ce2-36f2-4137-aec5-1e691bde53d9', '2026-07-06 14:53:36.986');

-- ----------------------------
-- Table structure for novel
-- ----------------------------
DROP TABLE IF EXISTS `novel`;
CREATE TABLE `novel`  (
  `id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `coverUrl` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `posterUrl` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `author` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('ONGOING','COMPLETED','PAUSED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ONGOING',
  `views` int NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `editor` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `comboPrice` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `Novel_slug_key`(`slug`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of novel
-- ----------------------------
INSERT INTO `novel` VALUES ('94247be9-1da8-4c62-9197-1c17f4223631', 'Gả Kim Thoa', 'ga-kim-thoa-9424', 'Một câu giới thiệu vắn tắt: Ngoài mây Vu Sơn ra thì chẳng đâu là mây\n\nNgụy Nhiêu của phủ Thừa An Bá có dung mạo nghiêng nước nghiêng thành nhưng lại mang tiếng xấu đồn xa. Trước khi bước vào cửa nhà họ Lục để xung hỉ, nàng đã thẳng thắn đưa ra ba điều kiện:\n\nTiền sính lễ phải đủ mười vạn.\n\nNếu Lục Trạc chết, nàng sẽ ra đi tay trắng, không lấy một đồng.\n\nNếu Lục Trạc sống sót, trong vòng năm năm tới, hắn tuyệt đối không được ly hôn hay đuổi nàng ra khỏi nhà.\n\nLục Trạc sau khi qua cơn bạo bệnh tỉnh lại, nghe kể về bản giao kèo này thì chỉ cười nhạt cho qua.\n\nTrong mắt hắn, Ngụy Nhiêu là kẻ lả lơi phóng túng, mang vẻ đẹp yêu mị họa thủy, tuyệt đối không bao giờ hợp với tiêu chuẩn vợ hiền dâu thảo.\n\nNể tình bản hợp đồng, hắn sẽ không đuổi nàng đi, nhưng nàng cũng đừng hòng mơ mộng nhận được dù chỉ một chút tình cảm hay sự sủng ái nào từ hắn.\n\nThế nhưng, đời không như là mơ. Về sau, Lục Trạc trọng thương trên chiến trường và bị mắc kẹt tại nước địch. Trải qua bao trắc trở, ngày hắn lặn lội về đến kinh thành mới vỡ lẽ tất cả mọi người đều đinh ninh rằng hắn đã tử trận.\n\nĐáng nói hơn, cô vợ nhỏ mà hắn ngày đêm thương nhớ lại dám ôm con gái dọn thẳng về nhà ngoại. Thậm chí, nghe giang hồ đồn thổi nàng đang rục rịch kén cha dượng mới cho con gái hắn!\n\nLục Trạc: ……', '/api/media/3f152dad-e4c0-4d3a-a57a-4ba1a9eae584.jpg', '/api/media/e5359af7-7b4b-4367-844f-f2692d3066ea.jpg', 'Tiếu Giai Nhân', 'COMPLETED', 0, '2026-07-06 12:37:20.000', '2026-07-06 12:37:20.000', 'Sủi Cảo Sốt Bơ', NULL);
INSERT INTO `novel` VALUES ('5e8bf72a-24a1-4449-9ad5-7be082c34c28', 'Thái tử hắn phu bằng tử quý', 'thai-tu-han-phu-bang-tu-quy-5e8b', 'Thiếu phụ kiều diễm tham tài háo sắc × Thái tử chó điên cao lãnh cấm dục\n\n1.\n\nÂn Vãn Chi gả xung hỉ vào Tống gia giàu nứt đố đổ vách. Nàng cứ đinh ninh là đến để hưởng phúc, nào ngờ trượng phu bệnh tật ốm yếu, lại còn có bệnh ẩn về phương diện kia, dưới gối mãi vẫn không có mụn con.\n\nCha chồng qua đời, bầy sói trong tộc rình rập tứ phía, ai nấy đều dòm ngó khối gia sản bạc triệu, chỉ chờ nhánh này hoàn toàn không thể có con nối dõi.\n\nNàng bị đẩy lên đầu sóng ngọn gió, người trượng phu nằm trên giường bệnh lại đẩy nàng ra ngoài để mong có thể nối dõi tông đường.\n\nKhông nỡ buông bỏ phú quý ngập trời này, Ân Vãn Chi cuối cùng cũng cắn răng đồng ý. Quan sát mấy ngày, nàng nhắm trúng một thư sinh thanh tú đến Giang Nam học. Người nọ mày rậm mắt sáng, thanh tao thoát tục như trích tiên, ăn nói lại toát lên vẻ tài hoa hơn người.\n\nTốn chín trâu hai hổ, rốt cuộc nàng cũng câu dẫn được người nọ lên giường, từ đó đêm đêm quấn quýt si mê. Cho đến khi được chẩn đoán mang thai, tảng đá trong lòng Ân Vãn Chi mới rơi xuống. Ngay đêm đó, nàng để lại hai tờ ngân phiếu cùng một mảnh giấy nhắn, lặng lẽ rời đi.\n\nKhông lâu sau, Tống phủ ở Giang Nam chợt có khách quý đến nhà.\n\nLúc cả phủ quỳ xuống nghênh đón, Ân Vãn Chi ngẩng đầu, chạm ngay phải một đôi mắt phượng sâu thẳm lạnh lẽo.\n\nGương mặt kia, nàng không thể quen thuộc hơn.\n\nKhông phải chàng thư sinh thanh tú kia thì còn là ai?!\n\nChỉ là giờ phút này, hắn thân mặc cẩm bào thắt đai ngọc, ngồi chễm chệ trên ghế chủ vị, đang cười như không cười liếc nhìn nàng.\n\nÂn Vãn Chi tối sầm mặt mũi, cả người gần như nhũn ra.\n\n2.\n\nCó tin đồn rằng, khi Thái tử vi hành Giang Nam, từng bị một nữ tử lừa gạt cả thể xác lẫn trái tim.\n\nĐến cuối cùng, nữ tử kia còn chê hắn không hiểu phong tình, để lại thư rồi bỏ trốn.\n\nHiện giờ, hắn nhìn Tống gia thiếu phu nhân đang quỳ bên dưới, phần bụng đã hơi nhô lên, chậm rãi mỉm cười.\n\n\"Thai này của phu nhân, phải cẩn thận mà sinh cho tốt.\"\n\n\"Suy cho cùng,\" đầu ngón tay hắn khẽ gõ lên mặt bàn, giọng nói lạnh lẽo như ngọc vỡ, \"Đó cũng là cốt nhục của cô.\"\n\n【Chú ý】\n\nNữ không sạch/ nam sạch, truyện cẩu huyết cẩu huyết vô cùng cẩu huyết!! Đủ các loại gu mặn hầm bà lằng.\n\nTình cảm nam nữ chính từ đầu đến cuối đều là 1V1, nam phụ (chồng cũ) từ đầu đã hòa ly.\n\nTriều đại không có thật, bối cảnh giả tưởng.\n\nTác giả mỏng manh dễ vỡ, nếu bỏ truyện xin đừng buông lời cay đắng.\n\nMột số chỗ trong văn án đã được điều chỉnh chút xíu (để logic hợp lý hơn), nhưng những màn theo đuổi thì vẫn giữ nguyên.', '/api/media/4db8f88d-6da0-45f2-968d-c5957cea2c3f.jpg', '/api/media/c8dde6e2-8dab-49ea-a5c3-e55305e24025.jpg', 'Sủi Cảo Sốt Bơ', 'ONGOING', 17, '2026-07-06 12:38:13.000', '2026-07-06 12:38:13.000', NULL, NULL);
INSERT INTO `novel` VALUES ('f0a1d369-001b-457b-84a4-81fa9a908c4e', 'Vân Nghê Chi Thượng', 'van-nghe-chi-thuong-f0a1', 'Mô tả\nGiới thiệu vắn tắt:\n\nTẩu tử, tẩu đỏ mặt cái gì?\n\nVăn án:\n\nHuynh trưởng vốn ít nói dạo gần đây lại để ý một nữ tử. Nàng tên là Nhiễm Dạng, sống nhờ tại Quý gia với thân phận biểu cô nương.\n\nQuý Tự có chút ấn tượng về nàng: xinh đẹp, nhút nhát, hễ nhìn hắn là lại đỏ mặt. Một đóa hoa tầm gửi vô dụng, nếu là ngày thường, Quý Tự sẽ chẳng thèm liếc mắt lấy một cái. Nhưng không khéo, huynh trưởng phải đi công tác xa, trước khi đi đã năm lần bảy lượt dặn dò hắn phải chiếu cố nàng. Nể tình huynh trưởng, Quý Tự mới để tâm đến nàng thêm vài phần.\n\nBiến cố ập đến rất nhanh. Vào một đêm tối trời gió lớn. Vị \"tẩu tử tương lai\" nhẹ nhàng dựa vào lòng hắn. Dưới màn đêm, thiếu nữ men say chếnh choáng, đôi môi đỏ mọng, mượn rượu nói lời thật lòng với hắn.\n\n\"Ca ca, muội thích huynh.\"\n\n\"...\" Hừ, không ngoài dự đoán.\n\nSự quyến rũ của nàng càng lúc càng quá đà, thế mà lại vòng tay ôm lấy cổ hắn, dịu dàng thì thầm: \"Quý công tử, đêm đã khuya rồi.\"\n\nKhi Nhiễm Dạng tỉnh dậy thì mặt trời đã lên cao ba sào. Nàng lờ mờ nhớ ra mình đã có một giấc mơ táo bạo, trong mơ nàng đã tỏ tình với Đại công tử nhà họ Quý.\n\nĐúng lúc này, Nhị công tử Quý Tự sải bước đi vào. Nhiễm Dạng vẫn còn dư âm của men rượu, lúc đứng dậy hành lễ thì không cẩn thận ngã nhào. Người đàn ông vốn lạnh lùng kia lại đưa tay ra đúng lúc, giữ chặt lấy eo nàng.\n\nTư thế quá mức thân mật, Nhiễm Dạng kinh hoàng không thôi, định đứng dậy tránh đi. Người đàn ông vẫn bóp chặt eo nàng, giọng trầm thấp, nhíu mày cảnh cáo: \"Đang đông người, gấp cái gì.\"\n\n\"...\"\n\nKể từ đó, mọi chuyện bắt đầu trở nên kỳ lạ một cách khó hiểu.\n\n[Thiết lập nhân vật] Tiểu khả ái ngây ngô như người máy x Trai bên ngoài lạnh lùng, bên trong dễ rung động. 1v1, Sạch, HE.\n\n◉ Thông tin truyện:\n\nNhân vật chính: Nhiễm Dạng, Quý Tự.\n\nGóc nhìn: Nữ chính.\n\nThông điệp: Dũng cảm đối mặt với chính mình.\n\n【Hướng dẫn đọc】\n\n1. Nam chính là Quý Tự, con thứ nhà họ Quý.\n\n2. Nữ chính và anh trai nam chính không có quan hệ hôn ước', '/api/media/3c6c660e-dc77-419a-b7d9-4ffd5948d04f.jpg', '/api/media/287dd7ad-36b5-46ee-a8cd-92ce624bb6be.jpg', ' Thịnh Vãn Phong', 'ONGOING', 4, '2026-07-06 12:38:50.000', '2026-07-06 12:38:50.000', 'Sủi Cảo Sốt Bơ', NULL);
INSERT INTO `novel` VALUES ('effe60b5-0340-4064-9667-aa7512797a0f', 'Hướng Minh Nguyệt', 'huong-minh-nguyet-effe', 'Giới thiệu tóm tắt trong một câu: Thiếu gia và nha hoàn.\n\nThiên Lộc thức đêm đọc tiểu thuyết, xuyên vào một cuốn sảng văn thăng cấp bằng con đường khoa cử của đại nam chủ không CP. Nàng xuyên thành nha hoàn hồi môn của người vợ cả của nam chính.\n\nNam chính Thôi Ngang, một đời danh thần.\n\nThời niên thiếu đỗ đạt, Tam nguyên cập đệ. Từ nhỏ đã đính ước với cháu gái đích tôn của Tể tướng. Cả đời quan lộ thuận buồm xuôi gió, cuối cùng quyền khuynh triều dã, giữ chức Tể tướng.\n\nThiên Lộc cẩn trọng cần mẫn làm nha hoàn, chỉ mong có một ngày có thể chuộc lại thân nô tỳ, sống một cuộc đời tự do tự tại.\n\nNgười vợ cả Lư thị sau khi kết hôn mãi vẫn không có thai.\n\nMột ngày nọ, Lư thị gọi Thiên Lộc vào phòng, cho người hầu lui ra hết.\n\nHỏi: \"Hôm nay ta có lòng cho ngươi một ân huệ, từ nay về sau ngươi hãy kề cận hầu hạ sinh hoạt của thiếu gia, nếu trong bụng có tin vui, ta sẽ nâng ngươi lên làm thiếp thất, ngươi có nguyện ý không??\"\n\nNàng cả kinh, vội vã quỳ xuống, lớn tiếng đáp: \"Nô tỳ xuất thân bần hàn, thấp hèn như bùn đất, sao xứng với thiếu gia? Thiếu phu nhân xin đừng ban ân cho nô tỳ, nô tỳ gánh không nổi, cúi mong người thu hồi mệnh lệnh!\"\n\nLư thị kinh ngạc hồi lâu, sau ba lần bảy lượt xác nhận, cuối cùng cũng tha cho nàng: \"Lui ra đi.\"\n\nSau khi Thiên Lộc đi ra ngoài, từ sau tấm bình phong có một người bước ra. Chính là Thôi Ngang.\n\nThiếu niên thần sắc khó đoán, nhìn về phía cửa.\n\nLư thị: \"Phu quân, thiếp thấy Chức Nguyệt, Đồng Nhi dáng dấp lanh lợi ngoan ngoãn, khuôn mặt đoan chính, tính tình lại càng chu đáo hiền thuận. Theo ý thiếp, hay là cứ đưa bọn họ đến thư phòng của phu quân để hầu hạ trước?\"\n\nGiọng nói của thiếu niên trong trẻo, đôi mắt sáng lạnh lùng: \"Chuyện này để sau hẵng bàn.\"\n\nSau đó phất tay áo, xoay người rời đi.\n\n---\n\nLưu ý: Cả hai đều không sạch', '/api/media/f064b65c-6182-4798-ac1f-24be7e0fae87.jpg', '/api/media/a1f723a6-1fa6-40f1-863a-3767c9dd1f0d.jpg', '...', 'ONGOING', 3, '2026-07-06 12:39:32.000', '2026-07-06 12:39:32.000', 'Sủi Cảo Sốt Bơ', NULL);
INSERT INTO `novel` VALUES ('53320ce2-36f2-4137-aec5-1e691bde53d9', 'Hợp Hoan Tông Cấm Tiêu Thụ Cùng Tông', 'hop-hoan-tong-cam-tieu-thu-cung-tong-5332', 'Văn án:\n\nSau khi Đường Giảo bái nhập Hợp Hoan Tông, chăm chỉ khắc khổ, học một đống lí thuyết, vẫn chưa được thực hành.\n\nChờ mãi mới đến tuổi trưởng thành, sư tỷ mang theo nàng tham gia Đàn Môn yến, chỉ vào một dàn nam nhân bảo nàng chọn.\n\nTrên tòa có một vị kiếm tu, mặt mày sáng sủa, y phục mỏng nhẹ, thanh dật thản nhiên, y như một trích tiên, trái tim Đường Giảo manh động, giả bộ ngã vào lòng ngực hắn, lanh lẹ treo túi thơm lên chuôi kiếm của hắn, hai mắt rưng rưng xin lỗi, lỗ tai đỏ lên, bước từng bước lưu luyến rời đi.\n\nKiếm tu rất biết điều, màn đêm buông xuống liền theo địa chỉ được thêu trên túi thơm tìm đến.\n\nHai người trò chuyện vui vẻ với nhau, tình ý dâng trào, vô cùng ăn ý, Đường Giảo vừa mới đưa tay ôm lấy eo hắn, cánh tay kiếm tu đã vòng qua eo nàng rồi.\n\nVành tai chạm vào tóc mai, Đường Giảo xích nhẹ ra một chút, mềm giọng hỏi hắn tên họ là gì, tu sĩ của môn phái nào.\n\nKiếm tu hôn khóe môi nàng, giọng nói khàn khàn: \"Từ Trầm Vân, Hợp Hoan Tông\"\n\nĐường Giảo bừng tỉnh.\n\nĐường Giảo đẩy hắn ra.\n\nTừ Trầm Vân: ...?\n\nĐường Giảo nhanh chóng mặc áo ngoài vào, ngồi nghiêm chỉnh, dáng vẻ đoan trang.\n\nSau đó nàng cười gượng hai tiếng, nói: \"Haha, trùng hợp ghê, thì ra là đại sư huynh\"\n\nNàng gia nhập vào Hợp Hoan Tông mới có 3-4 năm, còn chưa gặp vị đại sư huynh bế quan 10 năm này.\n\nMọi người đều biết, Hợp Hoan Tông cấm tiêu thụ cùng tông.\n\nBởi vì công pháp giống nhau, cho nên không thể hỗ trợ nhau tu luyện được.\n\nTuy rằng hai bên đều là hình mẫu của nhau, nhưng Đường Giảo và Từ Trầm Vân vẫn quyết định buông tha cho đối phương.\n\nNhưng mà dù sao là đồng môn, có đôi khi không muốn gặp là có thể không gặp được.\n\nVí dụ như:\n\nĐường Giảo vừa mới đến gần một Đan tu, Từ Trầm Vân đã dán bên tai nàng, tha thiết khuyên bảo: \"Sư muôi, tên Đan tu này nhìn hơi đần, tu vi chắc không được cao lắm đâu, đổi người khác đi?\"\n\nLại ví dụ như:\n\nTừ Trầm Vân mời một vị nữ Kiếm tu đi chung với nhau, Đường Giảo khoanh tay trước ngực, nhẹ giọng cười với hắn: \"Sư huynh, nếu huynh thích kiểu này, không phải muội tốt hơn sao?\"\n\nMột đoạn thời gian sau, cả hai người đều không tìm được đối tượng thích hợp.\n\nRơi vào đường cùng, Đường Giảo và Từ Trầm Vân trải qua một cuộc nói chuyện nghiêm túc, quyết định hay là thử xem.\n\nNhưng mà... ai có thể nói cho nàng biết, đệ tử Hợp Hoan Tông với đệ tử Hợp Hoan Tông tu luyện như thế nào bây giờ?\n\nTiểu sư muội x Đại sư huynh\n\nNữ chính trông có vẻ ngây thơ đáng yêu, nam chính trông thanh nhã cao khiết, thế nên cả hai đều bị lừa.\n\nNữ chính là \"bạch thiết hắc\" (bề ngoài ngây thơ bên trong đen tối), ngọt ngào.\n\nTu luyện theo kiểu \"chân trái đạp chân phải bay lên trời\", xin đừng đào sâu logic.', '/api/media/aee9925c-df54-415d-84cf-8ea3baa977e5.jpg', '/api/media/1aae1b7b-fd29-40ba-8e5e-952b2cd61c28.jpg', ' Quan Sơn Miên', 'ONGOING', 107, '2026-07-06 12:40:07.000', '2026-07-06 12:40:07.000', 'Sủi Cảo Sốt Bơ', NULL);

-- ----------------------------
-- Table structure for novel_unlock_affiliate
-- ----------------------------
DROP TABLE IF EXISTS `novel_unlock_affiliate`;
CREATE TABLE `novel_unlock_affiliate`  (
  `id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `userId` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `novelId` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `unlockedAt` datetime(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `userId`(`userId` ASC, `novelId` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of novel_unlock_affiliate
-- ----------------------------
INSERT INTO `novel_unlock_affiliate` VALUES ('aeb44af0-d67a-4171-a8de-e5fb7376249e', 'b99f39d8-1476-4146-a5fd-156bfc20f71b', '5e8bf72a-24a1-4449-9ad5-7be082c34c28', '2026-07-09 13:29:24.000');

-- ----------------------------
-- Table structure for novelgenre
-- ----------------------------
DROP TABLE IF EXISTS `novelgenre`;
CREATE TABLE `novelgenre`  (
  `novelId` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `genreId` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`novelId`, `genreId`) USING BTREE,
  INDEX `NovelGenre_genreId_fkey`(`genreId`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of novelgenre
-- ----------------------------
INSERT INTO `novelgenre` VALUES ('94247be9-1da8-4c62-9197-1c17f4223631', '114adfd0-5402-49d7-995f-da68d478df48');

-- ----------------------------
-- Table structure for purchase
-- ----------------------------
DROP TABLE IF EXISTS `purchase`;
CREATE TABLE `purchase`  (
  `id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `chapterId` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `pricePaid` int NOT NULL,
  `purchasedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `Purchase_userId_chapterId_key`(`userId`, `chapterId`) USING BTREE,
  INDEX `Purchase_chapterId_fkey`(`chapterId`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of purchase
-- ----------------------------
INSERT INTO `purchase` VALUES ('00fc7be3-981a-4701-959d-46c664dbd014', 'b99f39d8-1476-4146-a5fd-156bfc20f71b', 'c72c832d-88ac-4124-9351-1be3c4b59254', 1, '2026-07-06 13:18:20.000');
INSERT INTO `purchase` VALUES ('cf820cc6-cb7c-4b4e-b3eb-447a962d3a44', 'b99f39d8-1476-4146-a5fd-156bfc20f71b', '7e7c8879-2df9-4a1b-9377-6a6a6e115704', 3, '2026-07-06 14:03:28.000');
INSERT INTO `purchase` VALUES ('91e98250-20c0-469a-85fb-f888a29db5da', 'b99f39d8-1476-4146-a5fd-156bfc20f71b', '8d639f30-5374-41fc-a7ec-ddb6ae4e7039', 0, '2026-07-09 08:50:44.000');
INSERT INTO `purchase` VALUES ('134bf219-123c-4d69-aed9-6b8af0cf0649', 'b99f39d8-1476-4146-a5fd-156bfc20f71b', '92929a36-0b80-4ed8-ac11-f54c2103feef', 0, '2026-07-09 13:03:46.000');

-- ----------------------------
-- Table structure for rating
-- ----------------------------
DROP TABLE IF EXISTS `rating`;
CREATE TABLE `rating`  (
  `id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `novelId` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `score` int NOT NULL,
  `comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `Rating_userId_novelId_key`(`userId`, `novelId`) USING BTREE,
  INDEX `Rating_novelId_fkey`(`novelId`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of rating
-- ----------------------------
INSERT INTO `rating` VALUES ('73fa4cbc-d106-4826-aa52-7470e3dec119', 'b99f39d8-1476-4146-a5fd-156bfc20f71b', '53320ce2-36f2-4137-aec5-1e691bde53d9', 5, 'hayhuynh', '2026-07-06 13:18:37.962');

-- ----------------------------
-- Table structure for reading_progress
-- ----------------------------
DROP TABLE IF EXISTS `reading_progress`;
CREATE TABLE `reading_progress`  (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `novelId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `lastChapter` int NULL DEFAULT NULL,
  `status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `updatedAt` datetime(3) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `unique_user_novel`(`userId` ASC, `novelId` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of reading_progress
-- ----------------------------
INSERT INTO `reading_progress` VALUES ('1a6d7e1f-b90b-4d2c-a916-002c1fb9b245', 'b99f39d8-1476-4146-a5fd-156bfc20f71b', 'hop-hoan-tong-cam-tieu-thu-cung-tong-5332', 2, 'READING', '2026-07-09 13:25:17.906');
INSERT INTO `reading_progress` VALUES ('b60046bc-de7c-4632-a5d3-003297f9b087', 'b99f39d8-1476-4146-a5fd-156bfc20f71b', 'thai-tu-han-phu-bang-tu-quy-5e8b', 3, 'READING', '2026-07-09 13:29:30.701');
INSERT INTO `reading_progress` VALUES ('bebe20ae-6d75-4af9-9a55-ee7c39afcff0', 'b99f39d8-1476-4146-a5fd-156bfc20f71b', '5e8bf72a-24a1-4449-9ad5-7be082c34c28', 1, 'COMPLETED', '2026-07-08 17:41:27.980');
INSERT INTO `reading_progress` VALUES ('cd6b897c-e6f2-475e-849f-668670356cc9', 'b99f39d8-1476-4146-a5fd-156bfc20f71b', 'van-nghe-chi-thuong-f0a1', 1, 'READING', '2026-07-09 13:28:03.549');
INSERT INTO `reading_progress` VALUES ('d1a47f40-c7e7-4fc8-bf9e-9186cbd741c3', 'b99f39d8-1476-4146-a5fd-156bfc20f71b', '53320ce2-36f2-4137-aec5-1e691bde53d9', 1, 'READING', '2026-07-08 17:13:42.754');
INSERT INTO `reading_progress` VALUES ('dae8179c-57c6-444b-95ea-eb183319ce6f', 'b99f39d8-1476-4146-a5fd-156bfc20f71b', 'huong-minh-nguyet-effe', 1, 'READING', '2026-07-09 08:50:44.291');

-- ----------------------------
-- Table structure for setting
-- ----------------------------
DROP TABLE IF EXISTS `setting`;
CREATE TABLE `setting`  (
  `key` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`key`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of setting
-- ----------------------------
INSERT INTO `setting` VALUES ('bank_id', 'TPB', '2026-07-06 12:15:00.706');
INSERT INTO `setting` VALUES ('bank_account', '08040125109', '2026-07-06 12:15:00.711');
INSERT INTO `setting` VALUES ('bank_name', 'TRINH HUU HUYNH', '2026-07-06 12:15:00.713');
INSERT INTO `setting` VALUES ('exchange_rate', '1000', '2026-07-06 12:15:00.715');
INSERT INTO `setting` VALUES ('bonus_percent', '0', '2026-07-06 12:15:00.717');

-- ----------------------------
-- Table structure for transaction
-- ----------------------------
DROP TABLE IF EXISTS `transaction`;
CREATE TABLE `transaction`  (
  `id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `amountXu` int NOT NULL,
  `amountMoney` int NOT NULL,
  `paymentMethod` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `paymentRef` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `status` enum('PENDING','COMPLETED','FAILED','CANCELLED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `Transaction_userId_fkey`(`userId`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of transaction
-- ----------------------------
INSERT INTO `transaction` VALUES ('8afdd64c-bf6a-48f7-95ab-b6d4e3c1046e', '27a993f1-04fc-452d-bdee-943d3f04a962', 50, 50000, 'VIETQR', 'NAP12720A317C9A', 'PENDING', '2026-07-06 14:24:24.456', '2026-07-06 14:24:24.456');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `passwordHash` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatarUrl` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `coins` int NOT NULL DEFAULT 0,
  `role` enum('USER','ADMIN') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USER',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `User_email_key`(`email`) USING BTREE,
  UNIQUE INDEX `User_username_key`(`username`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('b99f39d8-1476-4146-a5fd-156bfc20f71b', 'huynh080104@gmail.com', 'huynh080104', '$2b$10$5Fi7ORjROK/NT9PY/END4.rX31eudHPakI2iMQe4QZs89BUiZDGJu', NULL, 9996, 'ADMIN', '2026-07-06 11:58:52.000', '2026-07-06 14:03:28.000');
INSERT INTO `user` VALUES ('27a993f1-04fc-452d-bdee-943d3f04a962', 'huynh123@gmail.com', 'admin', '$2b$10$SAtJCWYM4xfcz/m7n/y5vODiOgFz787/wWFEoy4H0QW7O2ivgt1y.', NULL, 1000, 'ADMIN', '2026-07-06 14:23:15.000', '2026-07-06 14:23:15.000');

SET FOREIGN_KEY_CHECKS = 1;
