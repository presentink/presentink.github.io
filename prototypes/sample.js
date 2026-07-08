// Shared sample content for all prototypes.
// Real chapter text + real images (relative to /prototypes → ../c1, ../c2).
// Single source of truth: each image has an id; each .hl in the text carries data-link="<id> ...".
window.CHAPTERS = [
  {
    num: 'I',
    title: 'Beginnings and a Return',
    html: `
      <p>I have loved calligraphy since I was very young. When I was in primary-school age, I would
      sit down and practice for about an hour every day, entirely on my own initiative. I never had a
      teacher — I simply practiced with <span class="hl" data-link="img_1_1">calligraphy model
      books</span> and taught myself. That went on for a few years.</p>
      <p>Later, my love for calligraphy naturally led me to
      <span class="hl" data-link="img_1_2">Chinese painting</span>. During every winter and summer
      break, I painted almost every day, and the walls of my home were covered with my work. This
      spontaneous fascination stayed with me until high school.</p>`,
    images: [
      { id: 'img_1_1', caption: 'Calligraphy model books', label: 'Self-taught', src: '../c1/1_model_books.jpg' },
      { id: 'img_1_2', caption: 'Chinese painting', label: 'Painting', src: '../c1/2_chinese_painting.jpg' }
    ]
  },
  {
    num: 'II',
    title: 'Large Character Calligraphy',
    html: `
      <p>During this period, I also read extensively about calligraphy — its history, lineage,
      theories, and the biographies of calligraphers. One book had a profound influence on me:
      <span class="hl" data-link="img_2_1"><i>Yu-ichi Inoue: The Calligraphy Is for Everyone</i></span>.</p>
      <p>Inoue Yuichi was a pioneer of modern Japanese calligraphy. What struck me most was his
      <span class="hl" data-link="img_2_2a img_2_2b">giant single-character works created with
      enormous brushes</span>. They carried both tradition and bold innovation.</p>
      <p>So I began to shape my own practice. The first step was to have a
      <span class="hl" data-link="img_2_3">large brush custom-made</span> and to buy a lot of Xuan
      paper. Then I started <span class="hl" data-link="img_2_4a img_2_4b">looking for a studio, and
      in the nearby city of Vejle I found Spinderihallerne</span>, a former spinning mill turned into
      a creative hub. I rented a small spot of about three by three meters, and worked there mostly
      after hours and on weekends, which let me use the large shared spaces.</p>
      <p><span class="hl" data-link="img_2_5a img_2_5b">The early attempts of my calligraphy
      work</span> were, strictly speaking, not really "authentic." They were closer to an imitation
      of Inoue Yuichi. Most of my effort then went into experimenting with materials and techniques,
      feeling my way forward.</p>
      <p>Around this time another artist came into view — <span class="hl" data-link="img_2_6">Wang
      Dongling</span>, known for large characters and his own "chaos script." His focus on
      <span class="hl" data-link="img_2_7">cursive script</span> was especially significant to me. I
      felt an inherent connection between cursive writing and large-scale brushwork.</p>
      <p>Once I began <span class="hl" data-link="img_2_8a">writing large characters in cursive</span>,
      I could feel myself improving noticeably, often finishing a piece in one continuous motion.</p>`,
    images: [
      { id: 'img_2_1',  caption: 'Yu-ichi Inoue: The Calligraphy Is for Everyone', label: 'Key influence', src: '../c2/1_book.jpg' },
      { id: 'img_2_2a', caption: 'Inoue writing process', label: 'Process', src: '../c2/2a_inoue_writing.jpg' },
      { id: 'img_2_2b', caption: 'Giant single-character works', label: 'Innovation', src: '../c2/2b_inoue_work.jpg' },
      { id: 'img_2_3',  caption: 'Large custom-made brush', label: 'Tools', src: '../c2/3_brushes.jpeg' },
      { id: 'img_2_4a', caption: 'Spinderihallerne studio in Vejle', label: 'Workspace', src: '../c2/4a_spinderi.jpg' },
      { id: 'img_2_4b', caption: 'Studio workspace setup', label: 'Space', src: '../c2/4b_studio.jpeg' },
      { id: 'img_2_5a', caption: 'Early calligraphy attempts', label: 'Learning', src: '../c2/5a_early_attemps.jpg' },
      { id: 'img_2_5b', caption: 'Early calligraphy practice', label: 'Development', src: '../c2/5b_early_attemps.jpg' },
      { id: 'img_2_6',  caption: 'Wang Dongling — chaos script', label: 'Inspiration', src: '../c2/6_wangdongling.jpg' },
      { id: 'img_2_7',  caption: 'Cursive script (Huaisu, 737–799)', label: 'Cursive', src: '../c2/7_cursive.jpg' },
      { id: 'img_2_8a', caption: 'Cursive calligraphy work', label: 'Cursive', src: '../c2/8a_early_calligraphy.jpeg' }
    ]
  }
];
