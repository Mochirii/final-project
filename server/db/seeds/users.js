
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {email:'pp0.c26@7agxrm.com',password:'password',battlenet_id:'Samuel#1066'},
        {email:'pfa7u7.n0v7_iin@iw2fv4.com',password:'password',battlenet_id:'Rubye#3562'},
        {email:'28xmm0jsmpsf-@lfkh1eg9.com',password:'password',battlenet_id:'Stormy#691'},
        {email:'g-jmucg@92atcmqm4.com',password:'password',battlenet_id:'Lela#1231'},
        {email:'k0zwc-65c.2p@s6m2g64m3un.com',password:'password',battlenet_id:'Ena#29941'},
        {email:'23_tt1@4pmnrkgjmf.com',password:'password',battlenet_id:'Alix#727'},
        {email:'z6bp_9hm13z_on2@m6haywmadwh.com',password:'password',battlenet_id:'Eloisa#'},
        {email:'nk1.d3o@bxunlkajyn0z.com',password:'password',battlenet_id:'Alaina#'},
        {email:'a95n08@aeh9rrw.com',password:'password',battlenet_id:'Fawn#2565'},
        {email:'n7x_p_k1@atmnsmwym.com',password:'password',battlenet_id:'Evonne#3042'},
        {email:'2qm1uux..@iquujgtye.com',password:'password',battlenet_id:'Brandee#3771'},
        {email:'em2s7bdspx-da@j3t3ot2w.com',password:'password',battlenet_id:'Beth#1154'},
        {email:'gis29xsj36-iy_m@en8bq8ki.com',password:'password',battlenet_id:'Floria#3205'},
        {email:'x_6i0eof@vcbhuk.com',password:'password',battlenet_id:'Mariko#2006'},
        {email:'ifahrevng.kri2t@5ylcvpq1.com',password:'password',battlenet_id:'Marybelle#848'},
        {email:'5id@bgqjlqq3u.com',password:'password',battlenet_id:'Inell#2293'},
        {email:'3.phid2b4admrvc@rc5ze7.com',password:'password',battlenet_id:'Sabrina#1493'},
        {email:'fgbw-xvcmvru4v@h4ki8xyqze.com',password:'password',battlenet_id:'Hassan#2689'},
        {email:'7yp2iu8jd@55y7fhmz0.com',password:'password',battlenet_id:'Melissa#150'},
        {email:'4gez65dt0wa3ip@qp9lybesz-y8.com',password:'password',battlenet_id:'Allan#1745'},
        {email:'8iixpmk@hdnza9z2.com',password:'password',battlenet_id:'Jefferson#1150'},
        {email:'gwbsj@cw12wn.com',password:'password',battlenet_id:'Misha#515'},
        {email:'2tf0evjo3m3@pmyec5ijpj1x.com',password:'password',battlenet_id:'Sharleen#2748'},
        {email:'oc-328@qhanluvz.com',password:'password',battlenet_id:'Iluminada#1928'},
        {email:'p3kd7m@8cvlll0xxlzu.com',password:'password',battlenet_id:'Ara#2341'},
        {email:'qtw@p67-qujn.com',password:'password',battlenet_id:'Lemuel#460'},
        {email:'yb7_-9vki8i7tut@bv7rdr89m7n7.com',password:'password',battlenet_id:'Honey#3921'},
        {email:'8fo9@0m567dc1l8h.com',password:'password',battlenet_id:'Laure#789'},
        {email:'kql3t4yqeu6.1@u64813iu.com',password:'password',battlenet_id:'Hiedi#2107'},
        {email:'z27-xb5blhn@azdyeh.com',password:'password',battlenet_id:'Brianna#2899'},
        {email:'7cdu2@7ytv8.com',password:'password',battlenet_id:'Trent#1524'},
        {email:'hz018pynlm16p@85t-ah6cko5g.com',password:'password',battlenet_id:'Cordell#3354'},
        {email:'4_f@1f4x5yaq.com',password:'password',battlenet_id:'Son#3969'},
        {email:'5zfgv_2u_0oah57@n5ge4l69.com',password:'password',battlenet_id:'Kerri#3512'},
        {email:'34th@250p0f086.com',password:'password',battlenet_id:'German#1244'},
        {email:'399-z2ls0@pjikgm29die.com',password:'password',battlenet_id:'Antwan#1245'},
        {email:'dj.ih9c246wy4@imb1jr.com',password:'password',battlenet_id:'Lazaro#1254'},
        {email:'4g6sd92i24l_3uf@wv6nop-fy.com',password:'password',battlenet_id:'Genie#3770'},
        {email:'owznbpt@67v2w4q.com',password:'password',battlenet_id:'Maricruz#364'},
        {email:'pcxv1hp@cw5b2s.com',password:'password',battlenet_id:'Basilia#3139'},
        {email:'8_xhaa1@68jvsbb5ep81.com',password:'password',battlenet_id:'Heide#988'},
        {email:'0ozth2j1chub53b@3p7yyrf1sz.com',password:'password',battlenet_id:'Luna#14851'}
      ]);
    });
};
