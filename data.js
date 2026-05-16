// 論語データ / 论语数据
const lunyuData = {
  chapters: [
    {
      id: 1,
      title: "学而篇",
      titleJP: "学而篇",
      titleReading: "がくじへん",
      color: "#FF6B6B",
      icon: "📚",
      lessons: [
        {
          id: "1-1",
          original: "學而時習之，不亦說乎？",
          rubyText: "<ruby>學<rt>まな</rt></ruby>びて<ruby>時<rt>とき</rt></ruby>に<ruby>之<rt>これ</rt></ruby>を<ruby>習<rt>なら</rt></ruby>う、<ruby>亦<rt>また</rt></ruby><ruby>說<rt>よろこ</rt></ruby>ばしからず<ruby>乎<rt>や</rt></ruby>",
          jpReading: "まなびて　ときに　これを　ならう、　また　よろこばしからずや",
          zhExplanation: "学了知识之后，经常去温习和练习，不也是很高兴的事吗？",
          zhSimple: "多多学习、多多练习，是一件非常开心的事哦！",
          keywords: ["学习", "练习", "快乐"],
          difficulty: 1,
          audioText: "まなびて ときに これを ならう、また よろこばしからずや"
        },
        {
          id: "1-2",
          original: "有朋自遠方來，不亦樂乎？",
          rubyText: "<ruby>朋<rt>とも</rt></ruby>の<ruby>遠<rt>とお</rt></ruby>き<ruby>方<rt>ほう</rt></ruby>より<ruby>来<rt>きた</rt></ruby>る<ruby>有<rt>あ</rt></ruby>り、<ruby>亦<rt>また</rt></ruby><ruby>樂<rt>たの</rt></ruby>しからず<ruby>乎<rt>や</rt></ruby>",
          jpReading: "ともの　とおきほうより　きたるあり、　また　たのしからずや",
          zhExplanation: "有朋友从远方来看望你，不也是令人高兴的事吗？",
          zhSimple: "好朋友从很远的地方来看你，多么快乐啊！",
          keywords: ["朋友", "快乐", "相聚"],
          difficulty: 1,
          audioText: "とも の とおきほうより きたる あり、また たのしからずや"
        },
        {
          id: "1-3",
          original: "人不知而不慍，不亦君子乎？",
          rubyText: "<ruby>人<rt>ひと</rt></ruby><ruby>知<rt>し</rt></ruby>らずして<ruby>慍<rt>うら</rt></ruby>みず、<ruby>亦<rt>また</rt></ruby><ruby>君子<rt>くんし</rt></ruby>ならず<ruby>乎<rt>や</rt></ruby>",
          jpReading: "ひとしらずして　うらみず、また　くんし　ならずや",
          zhExplanation: "别人不了解我，我也不生气怨恨，这不正是君子的风度吗？",
          zhSimple: "就算别人不理解你，也不要生气，这样的人才是真正的好人哦！",
          keywords: ["君子", "宽容", "不生气"],
          difficulty: 2,
          audioText: "ひとしらずして うらみず、また くんし ならずや"
        }
      ]
    },
    {
      id: 2,
      title: "为政篇",
      titleJP: "為政篇",
      titleReading: "いせいへん",
      color: "#4ECDC4",
      icon: "⭐",
      lessons: [
        {
          id: "2-1",
          original: "吾十有五而志于學",
          rubyText: "<ruby>吾<rt>われ</rt></ruby><ruby>十有五<rt>じゅうご</rt></ruby>にして<ruby>學<rt>がく</rt></ruby>に<ruby>志<rt>こころざ</rt></ruby>す",
          jpReading: "われ　じゅうご　にして　がくに　こころざす",
          zhExplanation: "我十五岁的时候，就立志要认真学习。",
          zhSimple: "孔子说：我十五岁的时候，就下定决心好好学习！",
          keywords: ["志向", "学习", "立志"],
          difficulty: 1,
          audioText: "われ じゅうご にして がくに こころざす"
        },
        {
          id: "2-2",
          original: "三十而立",
          rubyText: "<ruby>三十<rt>さんじゅう</rt></ruby>にして<ruby>立<rt>た</rt></ruby>つ",
          jpReading: "さんじゅう　にして　たつ",
          zhExplanation: "三十岁的时候，我能够自立于世了。",
          zhSimple: "孔子说：三十岁时，我已经能独立面对生活了！",
          keywords: ["成长", "自立", "努力"],
          difficulty: 1,
          audioText: "さんじゅう にして たつ"
        },
        {
          id: "2-3",
          original: "溫故而知新，可以為師矣",
          rubyText: "<ruby>故<rt>ふる</rt></ruby>きを<ruby>溫<rt>あたた</rt></ruby>めて<ruby>新<rt>あたら</rt></ruby>しきを<ruby>知<rt>し</rt></ruby>る、<ruby>以<rt>もっ</rt></ruby>て<ruby>師<rt>し</rt></ruby>と<ruby>為<rt>な</rt></ruby>るべし",
          jpReading: "ふるきを　あたためて　あたらしきを　しる、もって　しと　なるべし",
          zhExplanation: "温习旧的知识，并从中发现新的东西，这样就可以成为别人的老师了。",
          zhSimple: "复习学过的知识，还能发现新东西，这样的人可以当老师啦！",
          keywords: ["复习", "学习", "温故知新"],
          difficulty: 2,
          audioText: "ふるきを あたためて あたらしきを しる、もって しと なるべし"
        }
      ]
    },
    {
      id: 3,
      title: "里仁篇",
      titleJP: "里仁篇",
      titleReading: "りじんへん",
      color: "#FFB347",
      icon: "💛",
      lessons: [
        {
          id: "4-1",
          original: "見賢思齊焉",
          rubyText: "<ruby>賢<rt>けん</rt></ruby>を<ruby>見<rt>み</rt></ruby>ては<ruby>齊<rt>ひと</rt></ruby>しからんことを<ruby>思<rt>おも</rt></ruby>う",
          jpReading: "けんを　みては　ひとしからんことを　おもう",
          zhExplanation: "看到有才德的人，就要想着向他看齐学习。",
          zhSimple: "看到厉害的人，要想着向他学习，变得和他一样棒！",
          keywords: ["学习", "榜样", "向善"],
          difficulty: 1,
          audioText: "けんを みては ひとしからんことを おもう"
        },
        {
          id: "4-2",
          original: "己所不欲，勿施於人",
          rubyText: "<ruby>己<rt>おのれ</rt></ruby>の<ruby>欲<rt>ほっ</rt></ruby>せざるところは、<ruby>人<rt>ひと</rt></ruby>に<ruby>施<rt>ほどこ</rt></ruby>すことなかれ",
          jpReading: "おのれの　ほっせざるところは、　ひとに　ほどこすことなかれ",
          zhExplanation: "自己不希望别人对自己做的事，就不要对别人做同样的事。",
          zhSimple: "自己不喜欢的事情，就不要去对别人这么做哦！",
          keywords: ["换位思考", "善良", "友爱"],
          difficulty: 2,
          audioText: "おのれの ほっせざるところは、ひとに ほどこすことなかれ"
        }
      ]
    },
    {
      id: 4,
      title: "述而篇",
      titleJP: "述而篇",
      titleReading: "じゅつじへん",
      color: "#A8E6CF",
      icon: "🌟",
      lessons: [
        {
          id: "7-1",
          original: "三人行，必有我師焉",
          rubyText: "<ruby>三人<rt>さんにん</rt></ruby><ruby>行<rt>ゆ</rt></ruby>けば、<ruby>必<rt>かなら</rt></ruby>ず<ruby>我<rt>わが</rt></ruby><ruby>師<rt>し</rt></ruby>あり",
          jpReading: "さんにん　ゆけば、　かならず　わがし　あり",
          zhExplanation: "三个人一起走路，其中一定有可以做我老师的人。",
          zhSimple: "和别人在一起，一定能找到值得你学习的地方！每个人都是你的老师！",
          keywords: ["谦虚", "学习", "师长"],
          difficulty: 1,
          audioText: "さんにん ゆけば、かならず わがし あり"
        },
        {
          id: "7-2",
          original: "知之者不如好之者",
          rubyText: "<ruby>之<rt>これ</rt></ruby>を<ruby>知<rt>し</rt></ruby>る<ruby>者<rt>もの</rt></ruby>は<ruby>之<rt>これ</rt></ruby>を<ruby>好<rt>この</rt></ruby>む<ruby>者<rt>もの</rt></ruby>に<ruby>如<rt>し</rt></ruby>かず",
          jpReading: "これを　しるものは　これを　このむものに　しかず",
          zhExplanation: "知道学习的人，不如喜欢学习的人；喜欢学习的人，不如以学习为乐的人。",
          zhSimple: "知道学习，不如喜欢学习；喜欢学习，不如把学习当成快乐的事！",
          keywords: ["兴趣", "快乐", "学习"],
          difficulty: 2,
          audioText: "これを しるものは これを このむものに しかず"
        }
      ]
    },
    {
      id: 5,
      title: "子罕篇",
      titleJP: "子罕篇",
      titleReading: "しかんへん",
      color: "#C3B1E1",
      icon: "💜",
      lessons: [
        {
          id: "9-1",
          original: "逝者如斯夫，不舍晝夜",
          rubyText: "<ruby>逝<rt>ゆ</rt></ruby>く<ruby>者<rt>もの</rt></ruby>は<ruby>斯<rt>かく</rt></ruby>の<ruby>如<rt>ごと</rt></ruby>きかな、<ruby>晝夜<rt>ちゅうや</rt></ruby>を<ruby>舍<rt>お</rt></ruby>かず",
          jpReading: "ゆくものは　かくのごときかな、　ちゅうやを　おかず",
          zhExplanation: "时间就像这流水一样啊，日夜不停地流逝！",
          zhSimple: "时间像河水一样不停流走，白天黑夜都不停歇，要珍惜时间哦！",
          keywords: ["时间", "珍惜", "努力"],
          difficulty: 2,
          audioText: "ゆくものは かくのごときかな、ちゅうやを おかず"
        }
      ]
    }
  ]
};
